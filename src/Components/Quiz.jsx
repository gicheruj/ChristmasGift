// src/Components/Quiz.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Snowfall from "react-snowfall";

const options = [
  { id: 1, label: "🎁 Cozy Blanket", message: "Work in Progress, haha" },
  { id: 2, label: "🍪 Sweet Cookies", message: "Work in Progress, haha" },
  { id: 3, label: "✨ Shiny Ornament", message: "Work in Progress, haha" },
];

export default function Quiz({ onContinue, onPrevious }) {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const handleSelect = (option) => {
    setSelected(option.id);
    setMessage(option.message);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white overflow-hidden px-4">
      <Snowfall color="white" snowflakeCount={100} />

      <h2
        className="text-3xl md:text-4xl font-bold mb-8 text-center"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Tiny Quiz
      </h2>

      <p
        className="mb-12 text-center text-lg md:text-xl px-2"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Which gift matches your personality today?
      </p>

      {/* Options */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => handleSelect(option)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-4 rounded-xl text-lg md:text-xl font-semibold shadow-lg transition ${
              selected === option.id
                ? "bg-red-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-yellow-300 text-lg md:text-xl mb-8 text-center"
        >
          {message}
        </motion.div>
      )}

      {/* Controls */}
      <div className="mt-12 flex gap-6">
        <motion.button
          onClick={onPrevious}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full text-lg font-bold shadow-md"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Previous
        </motion.button>

        {selected && (
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-red-700 hover:bg-red-600 rounded-full text-lg font-bold shadow-lg drop-shadow-xl"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Continue
          </motion.button>
        )}
      </div>
    </div>
  );
}
