// src/Components/Mystery.jsx
import React, { useRef, useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import { motion } from "framer-motion";

export default function Mystery({ onContinue, onPrevious }) {
  const canvasRef = useRef(null);
  const [completed, setCompleted] = useState(false);

  const message =
    "There will be a number of mini-games, you have to complete one before accessing the next one";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const canvasWidth = window.innerWidth * 0.9;
    const canvasHeight = 200;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw frost overlay
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let isDrawing = false;

    const getPointerPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      let x, y;
      if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      x *= canvas.width / rect.width;
      y *= canvas.height / rect.height;
      return { x, y };
    };

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      ctx.globalCompositeOperation = "source-over";
    };

    const checkCompletion = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let cleared = 0;

      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) cleared++;
      }

      const percent = (cleared / (canvas.width * canvas.height)) * 100;

      // === NEW LOGIC ===
      if (percent > 60 && !completed) {
        setCompleted(true);

        // Remove all frost instantly
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Disable scratching
        canvas.style.pointerEvents = "none";
      }
    };

    const handlePointerDown = (e) => {
      isDrawing = true;
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
    };

    const handlePointerMove = (e) => {
      if (!isDrawing) return;
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
    };

    const handlePointerUp = () => {
      isDrawing = false;
      checkCompletion();
    };

    // Mouse events
    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("mouseup", handlePointerUp);
    canvas.addEventListener("mouseleave", handlePointerUp);

    // Touch events
    canvas.addEventListener("touchstart", handlePointerDown);
    canvas.addEventListener("touchmove", handlePointerMove);
    canvas.addEventListener("touchend", handlePointerUp);

    return () => {
      canvas.removeEventListener("mousedown", handlePointerDown);
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("mouseleave", handlePointerUp);

      canvas.removeEventListener("touchstart", handlePointerDown);
      canvas.removeEventListener("touchmove", handlePointerMove);
      canvas.removeEventListener("touchend", handlePointerUp);
    };
  }, [completed]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-center text-white overflow-hidden px-4">
      <Snowfall color="white" snowflakeCount={100} />

      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
      />

      {/* === Instruction Text === */}
      <div className="mb-6 text-center">
        <p
          className="text-lg md:text-xl font-semibold"
          style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        >
          Swipe over the frosted box below to reveal your instructions!
          Swipe till the button appears,
        </p>
      </div>

      {/* === Hidden Message and Frost Layer === */}
      <div className="flex flex-col items-center">
        <div className="relative w-full md:w-3/4 h-52 bg-gray-800 flex items-center justify-center p-4 rounded-lg shadow-lg">
          <p
            className="text-xl md:text-2xl font-semibold text-center z-0"
            style={{ fontFamily: "'Mountains of Christmas', cursive" }}
          >
            {message}
          </p>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            style={{ touchAction: "none" }}
          />
        </div>

        {/* === Buttons appear AFTER frost is cleared === */}
        {completed && (
          <div className="mt-12 flex gap-6">
            {/* <motion.button
              onClick={onPrevious}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full text-lg font-bold shadow-md"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Previous
            </motion.button> */}

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
        )}
      </div>
    </div>
  );
}
