import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const login = useAuthStore.getState().login;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // بعد نجاح login:
      login(data.user, data.token);

      alert("Login successful 🔐");

      // redirect
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-10"
      >

        {/* Header */}
        <div className="text-center mb-10">

          <div className="text-6xl mb-4">
            🌿
          </div>

          <h1 className="text-4xl font-bold mb-3">
            Welcome Back
          </h1>

          <p className="text-gray-500">
            Login to continue shopping.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5"
        >

          <input
            type="email"
            placeholder="Email Address"
            className="input"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <div className="flex justify-end">

            <Link
              to="/forgot-password"
              className="text-green-600 text-sm"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-4 text-lg"
          >
            {loading
              ? "Logging in..."
              : "Login 🔐"}
          </button>

        </form>

        {/* Footer */}
        <div className="text-center mt-8">

          <p className="text-gray-500">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="text-green-600 font-semibold"
          >
            Create Account
          </Link>

        </div>

      </motion.div>

    </div>
  );
}