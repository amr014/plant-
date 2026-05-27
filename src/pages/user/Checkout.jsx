import { useState } from "react";
import { motion } from "framer-motion";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";

export default function Checkout() {
  const cart = useCartStore((state) => state.cart);

  const user = useAuthStore.getState().user;

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const notify =
    useNotificationStore.getState()
      .addNotification;

  // بيانات العميل
  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  // الدفع
  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [paymentProof, setPaymentProof] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // المجموع
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  // رفع صورة التحويل
  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const formData = new FormData();

      formData.append("image", file);

      const res = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      setPaymentProof(data.url);

      notify({
        type: "success",
        message:
          "Payment proof uploaded successfully ✅",
      });
    } catch (error) {
      notify({
        type: "error",
        message:
          "Failed to upload payment proof ❌",
      });
    }
  };

  // إنشاء الطلب
  const handleCheckout = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      // Validation
      if (
        !customerName ||
        !phone ||
        !address
      ) {
        notify({
          type: "warning",
          message:
            "Please fill all shipping info",
        });

        setLoading(false);
        return;
      }

      // لو الدفع تحويل لازم صورة
      if (
        paymentMethod !== "cod" &&
        !paymentProof
      ) {
        notify({
          type: "warning",
          message:
            "Please upload payment proof",
        });

        setLoading(false);
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            customerName,
            phone,
            address,

            products: cart.map(
              (item) => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty,
              })
            ),

            totalPrice: total,

            paymentMethod,

            paymentProof,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        notify({
          type: "error",
          message:
            data.message ||
            "Order failed ❌",
        });

        setLoading(false);
        return;
      }
     
      if (res.ok) {
      clearCart();

      notify({
        type: "success",
        message:
          "Order placed successfully 🚀",
      });
      }

      // تنظيف الفورم
      setCustomerName("");
      setPhone("");
      setAddress("");
      setPaymentProof("");

      setLoading(false);
    } catch (error) {
      notify({
        type: "error",
        message:
          "Something went wrong ❌",
      });

      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container-custom">

        <h1 className="text-4xl font-bold mb-10">
          Checkout 🧾
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping */}
            <div className="card">

              <h2 className="text-xl font-bold mb-4">
                Shipping Info
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  className="input"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                />

                <input
                  className="input"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                />

                <input
                  className="input md:col-span-2"
                  placeholder="Address"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* Payment */}
            <div className="card">

              <h2 className="text-xl font-bold mb-4">
                Payment Method 💳
              </h2>

              <div className="flex flex-col gap-3">

                <label className="flex gap-2">
                  <input
                    type="radio"
                    value="cod"
                    checked={
                      paymentMethod ===
                      "cod"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  Cash on Delivery 💵
                </label>

                <label className="flex gap-2">
                  <input
                    type="radio"
                    value="instapay"
                    checked={
                      paymentMethod ===
                      "instapay"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  Instapay ⚡
                </label>

                <label className="flex gap-2">
                  <input
                    type="radio"
                    value="vodafone_cash"
                    checked={
                      paymentMethod ===
                      "vodafone_cash"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  Vodafone Cash 📱
                </label>

                <label className="flex gap-2">
                  <input
                    type="radio"
                    value="orange_cash"
                    checked={
                      paymentMethod ===
                      "orange_cash"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  Orange Cash 📱
                </label>

              </div>

              {/* Upload */}
              {paymentMethod !== "cod" && (
                <div className="mt-5">

                  <p className="mb-2 font-medium">
                    Upload Payment Screenshot
                  </p>

                  <input
                    type="file"
                    onChange={handleUpload}
                  />

                </div>
              )}

            </div>

            {/* Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? "Processing..."
                : "Place Order 🛒"}
            </button>

          </div>

          {/* RIGHT */}
          <div className="card h-fit">

            <h2 className="text-xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between"
                >

                  <span>
                    {item.name} × {item.qty}
                  </span>

                  <span>
                    $
                    {item.price *
                      item.qty}
                  </span>

                </div>
              ))}

            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-lg">

              <span>Total</span>

              <span>${total}</span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}