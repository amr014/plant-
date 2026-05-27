import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../utils/currency";

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // EMPTY STATE
  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="text-7xl mb-4">🛒</div>

          <h1 className="text-3xl font-bold mb-2">
            Your cart is empty
          </h1>

          <p className="text-gray-500 mb-6">
            Add some plants to start your garden 🌿
          </p>

          <Link
            to="/products"
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">
            Shopping Cart 🛒
          </h1>

          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Clear cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT - ITEMS */}
          <div className="lg:col-span-2 space-y-4">

            {cart.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-2xl shadow-sm p-4 flex items-center gap-5"
              >

                {/* IMAGE */}
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image?.url || item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🌿</span>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Indoor Plant
                  </p>

                  <p className="text-green-600 font-bold mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* CONTROLS */}
                <div className="flex flex-col items-center gap-3">

                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-xl">

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-lg px-2"
                    >
                      -
                    </button>

                    <span className="font-semibold">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="text-green-600 font-bold px-2"
                    >
                      +
                    </button>

                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item._id, true)
                    }
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>

                </div>

              </motion.div>
            ))}
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="bg-white border rounded-2xl shadow-sm p-6 h-fit sticky top-24">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(10)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(5)}</span>
              </div>

            </div>

            <hr className="my-5" />

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span className="text-green-600">
                {formatPrice(totalPrice + 15)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="block text-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
            >
              Checkout
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}