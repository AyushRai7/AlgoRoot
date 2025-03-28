"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! 🎉", { autoClose: 2000 });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error("Error signing up ❌", { autoClose: 3000 });
        setError(data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-lg backdrop-blur-md bg-white/10 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-gray-300 text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
      </motion.div>
    </div>
  );
}
