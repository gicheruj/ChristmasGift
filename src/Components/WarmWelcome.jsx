// src/components/WarmWelcome.jsx
import React, { useEffect, useRef } from "react";
import Snowfall from "react-snowfall";
import { motion } from "framer-motion";

export default function WarmWelcome({ onContinue }) {

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Background Snow */}
      <Snowfall color="white" snowflakeCount={120} />

      {/* Big Welcome Message */}
      <motion.h1
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-5xl md:text-7xl font-bold text-center drop-shadow-lg"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Welcome
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.2 }}
        className="mt-6 text-xl md:text-3xl text-center"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Your adventure awaits
      </motion.p>

      {/* Continue Button */}
      <motion.button
        onClick={onContinue}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 px-10 py-4 bg-red-700 hover:bg-red-600 rounded-full text-xl md:text-2xl font-bold shadow-lg drop-shadow-xl"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Continue
      </motion.button>
    </div>
  );
}
