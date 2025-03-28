"use client";

import Image from "next/image";
import logo from "./assets/logo.png";
import { MdLogin } from "react-icons/md";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("./login");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br bg-gray-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="mb-6"
      >
        <Image 
          src={logo} 
          alt="Algo Root" 
          width={150} 
          className="rounded-2xl shadow-lg"
        />
      </motion.div>

      <motion.button
        className="flex items-center bg-white text-purple-700 px-6 py-3 text-xl font-semibold rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLogin}
      >
        Login
        <MdLogin size={24} className="ml-2" />
      </motion.button>
    </div>
  );
}
