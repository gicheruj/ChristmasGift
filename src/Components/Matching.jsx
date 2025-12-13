// src/Components/Matching.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Snowfall from "react-snowfall";

const icons = [
  { id: 1, emoji: "🎁", message: "Gift matched! 🎁" },
  { id: 2, emoji: "🍪", message: "Cookies matched! 🍪" },
  { id: 3, emoji: "⭐", message: "Stars matched! ⭐" },
  { id: 4, emoji: "❤️", message: "Hearts matched! ❤️" },
  { id: 5, emoji: "🎄", message: "Christmas Tree matched! 🎄" },
  { id: 6, emoji: "🔔", message: "Bells matched! 🔔" },
  { id: 7, emoji: "☃️", message: "Snowman matched! ☃️" },
  { id: 8, emoji: "🎅", message: "Santa matched! 🎅" },
];

export default function Matching({ onContinue, onPrevious }) {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [matched, setMatched] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Duplicate icons to create pairs and shuffle
    const shuffled = [...icons, ...icons]
      .map((a) => ({ ...a, uid: Math.random() }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      if (firstChoice.id === secondChoice.id) {
        setMatched((prev) => [...prev, firstChoice.id]);
        setMessages((prev) => [...prev, firstChoice.message]);
      }
      setTimeout(() => {
        setFirstChoice(null);
        setSecondChoice(null);
      }, 800);
    }
  }, [firstChoice, secondChoice]);

  const handleClick = (card) => {
    if (!firstChoice) {
      setFirstChoice(card);
    } else if (firstChoice && firstChoice.uid !== card.uid) {
      setSecondChoice(card);
    }
  };

  const isFlipped = (card) => {
    return (
      card === firstChoice ||
      card === secondChoice ||
      matched.includes(card.id)
    );
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white overflow-hidden px-4">
      <Snowfall color="white" snowflakeCount={100} />

      <h2
        className="text-3xl md:text-4xl font-bold mb-8 text-center"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Matching Mini-Game
      </h2>

      <p
        className="mb-12 text-center text-lg md:text-xl px-2"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Match the pairs of Christmas-themed icons!
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {cards.map((card) => (
          <motion.div
            key={card.uid}
            onClick={() => !isFlipped(card) && handleClick(card)}
            whileHover={{ scale: !isFlipped(card) ? 1.05 : 1 }}
            whileTap={{ scale: !isFlipped(card) ? 0.95 : 1 }}
            className={`cursor-pointer rounded-2xl shadow-lg p-6 h-32 flex items-center justify-center text-4xl transition-all ${
              isFlipped(card) ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            {isFlipped(card) ? card.emoji : "❓"}
          </motion.div>
        ))}
      </div>

      {/* Messages */}
      <div className="mt-6 space-y-2">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-lg md:text-xl text-yellow-300"
          >
            {msg}
          </motion.div>
        ))}
      </div>

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
