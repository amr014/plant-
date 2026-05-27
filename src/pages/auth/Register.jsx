import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      // error
      if (!response.ok) {
        alert(data.message);
        return;
      }

      // save token
      localStorage.setItem(
        "token",
        data.token
      );

      // save user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert(
        "Account created successfully 🚀"
      );

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
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-10"
      >

        {/* Header */}
        <div className="text-center mb-10">

          <div className="text-6xl mb-4">
            🌱
          </div>

          <h1 className="text-4xl font-bold mb-3">
            Create Account
          </h1>

          <p className="text-gray-500">
            Join our premium plant
            store.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          <input
            type="text"
            placeholder="Full Name"
            className="input"
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            className="input"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            required
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value,
              })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-4 text-lg"
          >
            {loading
              ? "Creating..."
              : "Create Account 🚀"}
          </button>

        </form>

        {/* Footer */}
        <div className="text-center mt-8">

          <p className="text-gray-500">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="text-green-600 font-semibold"
          >
            Login
          </Link>

        </div>

      </motion.div>

    </div>
  );
}