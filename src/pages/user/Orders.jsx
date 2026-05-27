import { useEffect, useState } from "react";
import { socket } from "../../socket";


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/orders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SOCKET REALTIME UPDATE
  // =========================
  useEffect(() => {
    fetchOrders();

    socket.on("orderUpdated", (data) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === data.orderId
            ? { ...order, status: data.status }
            : order
        )
      );
    });

    return () => {
      socket.off("orderUpdated");
    };
  }, []);

  // =========================
  // CANCEL ORDER
  // =========================
  const cancelOrder = async (id) => {
    const reason = prompt(
      "Why are you cancelling this order?"
    );

    if (!reason) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/orders/cancel/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id
              ? { ...order, status: "cancelled" }
              : order
          )
        );

        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="p-10">Loading ...</div>;
  }

  // =========================
  // STATUS HELPER (SaaS)
  // =========================
  const getStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      case "cancelled":
        return 0;
      default:
        return 1;
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        🧾 My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No orders yet
        </p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-2xl p-5 shadow"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">
                    Order ID
                  </p>
                  <h2 className="font-bold">
                    #{order._id.slice(-6)}
                  </h2>
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* INFO */}
              <div className="mt-4">
                <p>
                  Total:
                  <span className="font-bold text-green-600 ml-2">
                    ${order.totalPrice}
                  </span>
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Payment: {order.paymentMethod}
                </p>
              </div>

              {/* ORDER TIMELINE */}

              <div className="mt-6">

                {/* cancelled */}
                {order.status === "cancelled" ? (

                  <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl font-semibold">
                    ❌ This order has been cancelled
                  </div>

                ) : (

                  <div className="flex items-center justify-between relative">

                    {[
                      "pending",
                      "processing",
                      "shipped",
                      "delivered",
                    ].map((step, index) => {

                      const active =
                        getStatusStep(order.status) >=
                        index + 1;

                      return (

                        <div
                          key={step}
                          className="flex-1 flex flex-col items-center relative"
                        >

                          {/* line */}
                          {index !== 3 && (
                            <div
                              className={`absolute top-4 left-1/2 w-full h-1
                              ${
                                active
                                  ? "bg-green-500"
                                : "bg-gray-300"
                              }`}
                            />
                          )}

                          {/* circle */}
                          <div
                            className={`w-8 h-8 rounded-full z-10 flex items-center justify-center text-white text-sm
                            ${
                              active
                                ? "bg-green-600"
                                : "bg-gray-400"
                            }`}
                          >
                            ✓
                          </div>

                          {/* label */}
                          <p className="text-xs mt-2 capitalize">
                            {step}
                          </p>

                        </div>

                      );
                    })}

                  </div>

                 )}

                </div>

              {/* CANCEL RULE (SaaS RULE) */}
              {(order.status === "pending" ||
                order.status === "processing") && (
                <button
                  onClick={() =>
                    cancelOrder(order._id)
                  }
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}