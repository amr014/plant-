import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const cart = useCartStore((state) => state.cart);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );
  

  return (
    <motion.nav className="bg-white shadow-md sticky top-0 z-50">

      <div className="container-custom flex justify-between items-center py-4">

        {/* Logo */}
        <Link
          className="text-2xl font-bold text-green-600"
          to="/"
          onClick={() => setOpen(false)}
        >
          🌿 PlantStore
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          

          <Link to="/cart">
            Cart ({totalItems})
          </Link>

          {user && (
        <Link to="/profile" className="text-green-500">
          Profile
        </Link>
      )}

          {user && (
            <Link to="/orders">
              Orders
            </Link>
          )}

          {user?.role === "owner" && (
            <Link to="/admin">
              Admin
            </Link>
          )}

          <Link  to="/expert-care" className="text-green-600 font-semibold">
            👨‍🌾 Expert Care
          </Link>

          <Link to="/ai-doctor" className="text-green-600 font-semibold">
            🌿 AI Doctor
          </Link>

        </div>

        {/* Auth */}
        <div className="hidden md:flex gap-3 items-center">

          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.email}
              </span>

              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-secondary" to="/login">
                Login
              </Link>

              <Link className="btn-primary" to="/register">
                Register
              </Link>
            </>
          )}

        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden text-3xl"
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden bg-white border-t p-4 flex flex-col gap-4"
        >

          <Link onClick={() => setOpen(false)} to="/">
            Home
          </Link>

          <Link onClick={() => setOpen(false)} to="/products">
            Products
          </Link>

          <Link onClick={() => setOpen(false)} to="/cart">
            Cart ({totalItems})
          </Link>

          {user && (
            <Link onClick={() => setOpen(false)} to="/orders">
              Orders
            </Link>
          )}

          <Link onClick={() => setOpen(false)} to="/expert-care">
            👨‍🌾 Expert Care
          </Link>

          <Link onClick={() => setOpen(false)} to="/ai-doctor">
            🌿 AI Doctor
          </Link>

          {user?.role === "owner" && (
            <Link onClick={() => setOpen(false)} to="/admin">
              Admin
            </Link>
          )}

          <hr />

          {user ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="btn-secondary"
            >
              Logout
            </button>
          ) : (
            <>
              <Link className="btn-secondary" to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>

              <Link className="btn-primary" to="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}

        </motion.div>
      )}

    </motion.nav>
  );
}