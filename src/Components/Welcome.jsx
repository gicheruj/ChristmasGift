// src/components/Welcome.jsx
import React from "react";
import Snowfall from "react-snowfall";
import { motion } from "framer-motion";

export default function Welcome({ onContinue, onPrevious }) {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Snow animation */}
      <Snowfall color="white" snowflakeCount={80} />

      {/* Optional: subtle sparkling stars animation */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
      >
        {/* You can layer more sparkles or light animations here */}
      </motion.div>

      {/* Mystery Text */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-4xl md:text-6xl text-center drop-shadow-lg px-4"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Someone special prepared something special for you
      </motion.h1>

      {/* Buttons */}
      <div className="mt-12 flex gap-8">
        {/* <motion.button
          onClick={onPrevious}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full text-lg md:text-xl font-bold shadow-md"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Previous
        </motion.button> */}

        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-red-700 hover:bg-red-600 rounded-full text-lg md:text-xl font-bold shadow-lg drop-shadow-xl"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}
