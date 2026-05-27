import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Overlay (Mobile only) */}
      <AnimatePresence>
        {open && (
          <motion.div
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black md:hidden z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: open || window.innerWidth >= 768 ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="
          fixed md:static z-50
          bg-gray-900 text-white p-5
          w-64 h-full
        "
      >
        <h2 className="text-xl font-bold mb-6">
          Admin Panel ⚙️
        </h2>

        <nav className="flex flex-col gap-3">

          <Link onClick={closeMenu} to="/admin">
            Dashboard
          </Link>

          <Link onClick={closeMenu} to="/admin/products">
            Products
          </Link>

          <Link onClick={closeMenu} to="/admin/orders">
            Orders
          </Link>

        </nav>
      </motion.div>

      {/* Content */}
      <div className="flex-1 p-6">

        {/* Mobile Button */}
        <button
          className="md:hidden mb-4 btn-primary"
          onClick={() => setOpen(true)}
        >
          ☰ Menu
        </button>

        <Outlet />
      </div>

    </div>
  );
}