// src/Components/Tree.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Tree({ onContinue }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const starRef = useRef(null);
  const targetRef = useRef(null);
  const [placed, setPlaced] = useState(false);

  const handleDrag = (_e, info) => {
    setPosition({ x: info.point.x, y: info.point.y });

    if (!starRef.current || !targetRef.current) return;

    const starBox = starRef.current.getBoundingClientRect();
    const targetBox = targetRef.current.getBoundingClientRect();

    const overlap = !(
      starBox.right < targetBox.left ||
      starBox.left > targetBox.right ||
      starBox.bottom < targetBox.top ||
      starBox.top > targetBox.bottom
    );

    if (overlap && !placed) {
      setPlaced(true);

      setTimeout(() => {
        onContinue(); // go to final page automatically
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-700 to-green-900 text-white relative overflow-hidden">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 animate-pulse">
        Place the Star on the Christmas Tree 🎄⭐
      </h1>

      <div className="relative">

        {/* 🎄 Christmas Tree (SVG — no broken images!) */}
        <div className="relative">
          <svg
            width="260"
            height="380"
            viewBox="0 0 260 380"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="130,20 40,140 220,140" fill="#1b5e20" />
            <polygon points="130,90 30,220 230,220" fill="#2e7d32" />
            <polygon points="130,170 20,300 240,300" fill="#388e3c" />
            <rect x="110" y="300" width="40" height="70" fill="#6d4c41" />
          </svg>

          {/* Invisible target spot */}
          <div
            ref={targetRef}
            className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-14"
          ></div>
        </div>

        {/* ⭐ Draggable Star */}
        <motion.div
          ref={starRef}
          drag
          dragMomentum={false}
          onDrag={handleDrag}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 cursor-pointer"
        >
          <motion.svg
            width="70"
            height="70"
            viewBox="0 0 100 100"
            animate={placed ? { scale: [1, 1.3, 1], rotate: 360 } : {}}
            transition={{ duration: 1 }}
          >
            <polygon
              points="50,5 61,35 95,35 67,55 78,85 50,67 22,85 33,55 5,35 39,35"
              fill={placed ? "#fff176" : "#ffeb3b"}
              stroke="#fdd835"
              strokeWidth="3"
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Celebration text */}
      {placed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-2xl font-semibold text-yellow-300"
        >
          ✨ Perfect! The tree is complete! ✨  
          <br />
          Preparing your final gift…
        </motion.div>
      )}
    </div>
  );
}
