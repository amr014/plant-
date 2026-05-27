import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cartService } from "../../services/cartService";
import { formatPrice } from "../../utils/currency";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // ===================================
  // FETCH PRODUCT
  // ===================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await res.json();

        setProducts(data);

        const found = data.find(
          (p) => p._id === id
        );

        setProduct(found);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ===================================
  // LOADING
  // ===================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf8] p-6">
        <div className="max-w-7xl mx-auto animate-pulse">

          <div className="grid lg:grid-cols-2 gap-10">

            <div className="h-[500px] bg-gray-200 rounded-[40px]"></div>

            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-32 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-40 mb-6"></div>
              <div className="h-14 bg-gray-200 rounded"></div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ===================================
  // NOT FOUND
  // ===================================
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8]">

        <div className="bg-white p-10 rounded-3xl shadow-sm text-center">

          <div className="text-7xl mb-5">
            🌿
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Product Not Found
          </h1>

          <p className="text-gray-500 mb-6">
            The product you are looking for does not exist.
          </p>

          <Link
            to="/products"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl"
          >
            Back To Products
          </Link>

        </div>

      </div>
    );
  }

  // ===================================
  // RELATED PRODUCTS
  // ===================================
  const relatedProducts = products.filter(
    (p) =>
      p.category === product.category &&
      p._id !== product._id
  );

  // ===================================
  // ADD TO CART
  // ===================================
  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      cartService.add(product);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8]">

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-10">

          <Link
            to="/products"
            className="hover:text-green-600"
          >
            Products
          </Link>

          <span>/</span>

          <span className="text-gray-900 font-medium">
            {product.name}
          </span>

        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >

            <div className="sticky top-28">

              <div className="overflow-hidden rounded-[40px] bg-gradient-to-br from-green-100 to-green-200 shadow-xl">

                {product.image ? (
                  <img
                    src={
                      product.image?.url ||
                      product.image
                    }
                    alt={product.name}
                    className="w-full h-[600px] object-cover hover:scale-105 transition duration-700"
                  />
                ) : (
                  <div className="h-[600px] flex items-center justify-center text-9xl">
                    🌿
                  </div>
                )}

              </div>

            </div>

          </motion.div>

          {/* INFO */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >

            {/* CATEGORY */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-5">
              {product.category}
            </div>

            {/* TITLE */}
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-lg leading-8 mb-8">
              {product.description ||
                "Beautiful premium plant perfect for home decoration and improving your indoor atmosphere."}
            </p>

            {/* PRICE */}
            <div className="flex items-center gap-4 mb-8">

              <span className="text-5xl font-black text-green-700">
                {formatPrice(product.price)}
              </span>

              {product.stock > 0 ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Out Of Stock
                </span>
              )}

            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-4 mb-10">

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-2">
                  Watering
                </p>

                <h3 className="font-bold text-lg">
                  Moderate 💧
                </h3>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-2">
                  Light
                </p>

                <h3 className="font-bold text-lg">
                  Indirect ☀️
                </h3>
              </div>

            </div>

            {/* QUANTITY */}
            <div className="mb-10">

              <p className="font-semibold text-gray-900 mb-4">
                Quantity
              </p>

              <div className="flex items-center gap-4">

                <button
                  onClick={() =>
                    qty > 1 &&
                    setQty(qty - 1)
                  }
                  className="w-14 h-14 rounded-2xl bg-white border border-gray-200 text-2xl hover:bg-gray-100 transition"
                >
                  -
                </button>

                <div className="w-20 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-2xl font-bold">
                  {qty}
                </div>

                <button
                  onClick={() =>
                    setQty(qty + 1)
                  }
                  className="w-14 h-14 rounded-2xl bg-white border border-gray-200 text-2xl hover:bg-gray-100 transition"
                >
                  +
                </button>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                className="flex-1 h-16 rounded-3xl bg-green-600 hover:bg-green-700 text-white text-lg font-bold shadow-lg transition"
              >
                Add To Cart 🛒
              </motion.button>

              <button className="h-16 px-8 rounded-3xl bg-white border border-gray-200 hover:bg-gray-100 transition text-lg">
                ❤️ Wishlist
              </button>

            </div>

            {/* EXTRA INFO */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

              <h3 className="text-xl font-bold mb-5">
                Plant Care Tips 🌱
              </h3>

              <div className="space-y-4 text-gray-600 leading-7">

                <p>
                  • Keep the soil slightly moist but avoid overwatering.
                </p>

                <p>
                  • Place the plant near indirect sunlight.
                </p>

                <p>
                  • Clean leaves regularly for healthy growth.
                </p>

              </div>

            </div>

          </motion.div>

        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-28">

            <div className="flex items-center justify-between mb-10">

              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-2">
                  Related Products 🌿
                </h2>

                <p className="text-gray-500">
                  More plants you may like
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

              {relatedProducts
                .slice(0, 4)
                .map((item, index) => (

                  <motion.div
                    key={item._id}
                    initial={{
                      opacity: 0,
                      y: 40,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -8,
                    }}
                    className="group bg-white rounded-[30px] overflow-hidden shadow-sm hover:shadow-2xl transition border border-gray-100"
                  >

                    {/* IMAGE */}
                    <div className="h-72 overflow-hidden bg-gradient-to-br from-green-100 to-green-200">

                      {item.image ? (
                        <img
                          src={
                            item.image?.url ||
                            item.image
                          }
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-7xl">
                          🌿
                        </div>
                      )}

                    </div>

                    {/* INFO */}
                    <div className="p-5">

                      <p className="text-sm text-green-600 font-medium mb-2">
                        {item.category}
                      </p>

                      <h3 className="text-xl font-bold mb-3 line-clamp-1">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between mb-5">

                        <span className="text-2xl font-black text-green-700">
                          {formatPrice(item.price)}
                        </span>

                      </div>

                      <Link
                        to={`/product/${item._id}`}
                        className="h-12 rounded-2xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center font-semibold transition"
                      >
                        View Product
                      </Link>

                    </div>

                  </motion.div>
                ))}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}