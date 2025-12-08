// src/Components/Memory.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Snowfall from "react-snowfall";

export default function Memory({ onContinue, onPrevious }) {
  const scenes = [
    {
      title: "A moment from this year…",
      message: "You shone bright during the holiday party! 🎉",
      color: "bg-red-600",
    },
    {
      title: "A quality people love about you…",
      message: "Your kindness warms everyone around you! ❤️",
      color: "bg-green-600",
    },
    {
      title: "My wish for you...",
      message: "May joy and laughter follow you all year! 🎄",
      color: "bg-blue-600",
    },
  ];

  const [selected, setSelected] = useState(null);

  const handleClick = (index) => {
    setSelected(index);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white overflow-hidden px-4">
      <Snowfall color="white" snowflakeCount={100} />

      <h2
        className="text-3xl md:text-4xl font-bold mb-8 text-center"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Memory Path Game
      </h2>

      <p
        className="mb-12 text-center text-lg md:text-xl px-2"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Click each card to reveal a special memory!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {scenes.map((scene, index) => (
          <motion.div
            key={index}
            onClick={() => handleClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer rounded-2xl shadow-lg p-6 h-48 flex flex-col items-center justify-center transition-all ${
              selected === index ? scene.color : "bg-gray-700"
            }`}
          >
            <h3
              className="text-xl font-bold mb-2 text-center"
              style={{ fontFamily: "'Mountains of Christmas', cursive" }}
            >
              {scene.title}
            </h3>
            {selected === index && (
              <motion.p
                className="text-center mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {scene.message}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

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

        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-red-700 hover:bg-red-600 rounded-full text-lg font-bold shadow-lg drop-shadow-xl"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}
