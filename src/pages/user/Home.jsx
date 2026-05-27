import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div>

      {/* Hero */}
      <section className="section">

        <div className="container-custom grid md:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >

            <h1 className="text-6xl font-bold leading-tight mb-6">
              Bring Nature
              <span className="text-green-600">
                {" "}Into Your Home 🌿
              </span>
            </h1>

            <p className="text-gray-600 text-lg mb-8">
              Discover premium indoor and outdoor plants
              with modern style and fast delivery.
            </p>

            <div className="flex gap-4">

              <Link
                to="/products"
                className="btn-primary"
              >
                Shop Now
              </Link>

              {/* ✅ FIXED */}
              <Link
                to="/products"
                className="btn-secondary"
              >
                Explore
              </Link>

              <Link 
                to="/expert-care"
                className="btn-primary"
              >
                👨‍🌾 Expert Care
              </Link>

              <Link
                to="/ai-doctor"
                className="btn-primary"
              >
                🌱 Plant Doctor AI
              </Link>

            </div>

          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative"
          >

            <div className="h-[500px] rounded-[40px] bg-gradient-to-br from-green-200 to-green-500 shadow-2xl flex items-center justify-center">

              <span className="text-8xl">
                🌿
              </span>

            </div>

          </motion.div>

        </div>

      </section>

      {/* Features */}
      <section className="section bg-white">

        <div className="container-custom">

          <h2 className="section-title text-center">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="card text-center">
              <h3 className="text-2xl mb-3">
                🚚
              </h3>

              <h4 className="font-bold mb-2">
                Fast Delivery
              </h4>

              <p className="text-gray-500">
                Get your plants delivered quickly.
              </p>
            </div>

            <div className="card text-center">
              <h3 className="text-2xl mb-3">
                🌱
              </h3>

              <h4 className="font-bold mb-2">
                Healthy Plants
              </h4>

              <p className="text-gray-500">
                Carefully selected premium plants.
              </p>
            </div>

            <div className="card text-center">
              <h3 className="text-2xl mb-3">
                💳
              </h3>

              <h4 className="font-bold mb-2">
                Secure Payment
              </h4>

              <p className="text-gray-500">
                100% secure payment system.
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}