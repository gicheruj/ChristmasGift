// src/Components/Riddle.jsx
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Snowfall from "react-snowfall";

const Riddle = ({ onContinue, onPrevious }) => {
// function correctAns(ans) {
//   const lowerAns = ans.toLowerCase();
//   if (lowerAns.includes('deck') && lowerAns.includes('cards')) {
//     return true;
//   }
//   return false;
// }
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // idle, wrong, correct, opening, opened
  const [message, setMessage] = useState("");
  const [showHub, setShowHub] = useState(false);
  const correctAnswer = (ans) => {
  return ans.includes('deck') && ans.includes('cards');}; 
  const controlsLeft = useAnimation();
  const controlsRight = useAnimation(); 

  // Handle doors opening after correct answer
  useEffect(() => {
    if (status === "correct") {
      (async () => {
        // Shake doors
        await Promise.all([
          controlsLeft.start({
            rotateZ: [0, -6, 6, -4, 4, 0],
            transition: { duration: 0.9, times: [0, 0.16, 0.4, 0.66, 0.9, 1] },
          }),
          controlsRight.start({
            rotateZ: [0, 6, -6, 4, -4, 0],
            transition: { duration: 0.9, times: [0, 0.16, 0.4, 0.66, 0.9, 1] },
          }),
        ]);

        setStatus("opening");

        await new Promise((r) => setTimeout(r, 500));

        // Open doors
        await Promise.all([
          controlsLeft.start({
            rotateY: [-10, -70],
            x: [-1, -120],
            transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
          }),
          controlsRight.start({
            rotateY: [10, 70],
            x: [1, 120],
            transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
          }),
        ]);

        setStatus("opened");
        setShowHub(true);
      })();
    }
  }, [status, controlsLeft, controlsRight]);

  const checkAnswer = (e) => {
    e.preventDefault();
    const normalized = (answer || "").trim().toLowerCase();
    if (!normalized) {
      setStatus("wrong");
      setMessage("Type your answer and press Enter.");
      setTimeout(() => setStatus("idle"), 1400);
      return;
    }
    if (correctAnswer(normalized)) {
      setStatus("correct");
      setMessage("Correct! Opening the door...");
    } else {
      setStatus("wrong");
      setMessage("Not quite — try again!");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 1400);
    }
  };

  const doorBase = `w-56 md:w-80 h-80 md:h-96 rounded-tl-2xl rounded-tr-2xl relative overflow-hidden shadow-2xl border border-black/40`;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#07101a] via-[#0b1a26] to-[#071018] text-white overflow-hidden">
      <Snowfall color="white" snowflakeCount={120} />

      <div className="z-20 max-w-6xl w-full px-6 py-12 flex flex-col items-center">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        >
          Solve this riddle to open the door...
        </motion.h2>

        <motion.p
          className="text-center text-lg md:text-xl text-gray-200 max-w-2xl mb-6 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          What has 13 hearts but no other organs?
        </motion.p>

        {!showHub && (
          <form onSubmit={checkAnswer} className="mb-8 w-full flex justify-center">
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={status === "opening" || status === "opened"}
              placeholder="Type your answer..."
              className={`bg-white/6 backdrop-blur-sm placeholder-gray-300 text-white px-4 py-3 rounded-xl w-80 md:w-96 focus:outline-none focus:ring-2 ${
                status === "wrong" ? "ring-red-500" : "ring-0"
              }`}
            />
            <button type="submit" className="ml-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition">
              Submit
            </button>
          </form>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm ${status === "wrong" ? "text-red-400" : "text-emerald-300"} mb-6`}
          >
            {message}
          </motion.div>
        )}

        <div className="relative flex items-center justify-center gap-6">
          {/* glow behind games */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={showHub ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute w-[400px] h-[200px] bg-yellow-300/20 rounded-xl blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />

          {/* games text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={showHub ? { opacity: 1 } : { opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">✨ GAMES ✨</div>
            <div className="mt-4 space-y-2">
              <div className="text-lg md:text-xl text-gray-200">🎁 Game 1: Memory Path</div>
              <div className="text-lg md:text-xl text-gray-200">🎄 Game 2: Mini Matching</div>
              <div className="text-lg md:text-xl text-gray-200">⭐ Game 3: Tiny Quiz</div>
            </div>
          </motion.div>

          {/* doors */}
          <motion.div
            animate={controlsLeft}
            initial={{ rotateY: 0, rotateZ: 0, x: 0 }}
            className={`transform perspective-800 origin-left ${doorBase} bg-gradient-to-b from-[#6b3f18] to-[#4b2a11]`}
            style={{
              boxShadow: "inset 0 6px 0 rgba(255,255,255,0.03), inset 0 -18px 40px rgba(0,0,0,0.6)",
            }}
          />
          <motion.div
            animate={controlsRight}
            initial={{ rotateY: 0, rotateZ: 0, x: 0 }}
            className={`transform perspective-800 origin-right ${doorBase} bg-gradient-to-b from-[#6b3f18] to-[#4b2a11]`}
            style={{
              boxShadow: "inset 0 6px 0 rgba(255,255,255,0.03), inset 0 -18px 40px rgba(0,0,0,0.6)",
            }}
          />
        </div>

        {/* Controls */}
        <div className="mt-12 flex gap-4">
          <button
            onClick={onPrevious}
            className="px-4 py-2 rounded-lg bg-white/6 hover:bg-white/12 border border-white/10 transition"
          >
            Previous
          </button>

          {showHub && (
            <motion.button
              onClick={onContinue}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-2 rounded-lg bg-amber-400 text-black font-semibold hover:bg-amber-300 transition"
            >
              Continue
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Riddle;
