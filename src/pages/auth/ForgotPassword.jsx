import { motion } from "framer-motion";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-10"
      >

        <h1 className="text-4xl font-bold mb-4 text-center">
          Reset Password 🔑
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Enter your email to receive OTP code.
        </p>

        <div className="flex flex-col gap-5">

          <input
            type="email"
            placeholder="Email Address"
            className="input"
          />

          <button className="btn-primary py-4">
            Send OTP
          </button>

        </div>

      </motion.div>

    </div>
  );
}