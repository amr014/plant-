import { socket } from "../../socket";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cartService } from "../../services/cartService";
import { formatPrice } from "../../utils/currency";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  // ====================================
  // Fetch Products
  // ====================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await res.json();

        setProducts(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ====================================
  // SOCKETS
  // ====================================
  useEffect(() => {
    socket.on("productCreated", (product) => {
      setProducts((prev) => [product, ...prev]);
    });

    socket.on("productUpdated", (updated) => {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === updated._id ? updated : p
        )
      );
    });

    socket.on("productDeleted", (id) => {
      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );
    });

    return () => {
      socket.off("productCreated");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, []);

  // ====================================
  // FILTER + SORT
  // ====================================
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search
    filtered = filtered.filter((p) =>
      p.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    // Category
    if (category !== "All") {
      filtered = filtered.filter(
        (p) => p.category === category
      );
    }

    // Sorting
    if (sort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      filtered.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return filtered;
  }, [products, search, category, sort]);

  const categories = [
    "All",
    "Indoor",
    "Outdoor",
    "Succulent",
    "Flowers",
  ];

  // ====================================
  // Loading Skeleton
  // ====================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf8] p-6">
        <div className="max-w-7xl mx-auto">

          <div className="animate-pulse">
            <div className="h-10 w-64 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-5 w-96 bg-gray-200 rounded mb-10"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm"
                >
                  <div className="h-64 bg-gray-200"></div>

                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf8]">

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HERO */}
        <div className="mb-12">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-4"
          >
            Explore Our Plants 🌿
          </motion.h1>

          <p className="text-gray-500 text-lg max-w-2xl">
            Discover beautiful indoor and outdoor plants
            for your home and workspace.
          </p>

        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-10">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}
            <input
              type="text"
              placeholder="Search plants..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="h-14 px-4 rounded-2xl border border-gray-200 outline-none"
            >
              <option value="default">
                Default Sorting
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="name">
                Name
              </option>
            </select>

          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mt-5">

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}

          </div>

        </div>

        {/* RESULTS */}
        <div className="flex items-center justify-between mb-6">

          <p className="text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            plants
          </p>

        </div>

        {/* EMPTY */}
        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm border">

            <div className="text-7xl mb-5">
              🌿
            </div>

            <h2 className="text-2xl font-bold mb-3">
              No Plants Found
            </h2>

            <p className="text-gray-500">
              Try changing search or category filters.
            </p>

          </div>
        )}

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

          {filteredProducts.map((p, index) => (

            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                y: -8,
              }}
              className="group bg-white rounded-[30px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >

              {/* IMAGE */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-green-100 to-green-200">

                {p.image ? (
                  <img
                    src={p.image?.url || p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">
                    🌿
                  </div>
                )}

                {/* STOCK BADGE */}
                <div className="absolute top-4 left-4">

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      p.stock > 0
                        ? "bg-white text-green-700"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {p.stock > 0
                      ? `${p.stock} In Stock`
                      : "Out of Stock"}
                  </span>

                </div>

              </div>

              {/* INFO */}
              <div className="p-5">

                <p className="text-sm text-green-600 font-medium mb-2">
                  {p.category}
                </p>

                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                  {p.name}
                </h2>

                <div className="flex items-center justify-between mb-5">

                  <span className="text-2xl font-black text-green-700">
                    {formatPrice(p.price)}
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      cartService.add(p)
                    }
                    className="flex-1 h-12 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                  >
                    Add to Cart
                  </motion.button>

                  <Link
                    to={`/product/${p._id}`}
                    className="flex-1 h-12 rounded-2xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center font-medium transition"
                  >
                    View
                  </Link>

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </div>
  );
}