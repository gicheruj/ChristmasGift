import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Snowfall from "react-snowfall";

/**
 * The Birthday Hunt (keeps original UI look & layout)
 *
 * - UI structure, fonts and controls follow the original Quiz.jsx layout.
 * - Gameplay:
 *   * A tiny hidden item (emoji) is placed somewhere in the illustrated scene.
 *   * Click anywhere inside the scene to "search" that spot.
 *   * If your click is within the hidden item's area you'll find it.
 *   * On each miss you get an immediate feedback ("Very close", "Close", "Nope").
 * - When the item is found a celebratory message appears and the Continue button becomes available.
 *
 * Props:
 *  - onContinue: called when the user presses Continue (only available after finding the item)
 *  - onPrevious: called when the user presses Previous
 *
 * Notes:
 *  - No letter-lines feature included (removed per request).
 *  - The visuals (fonts, snowfall, layout) are preserved from the original component.
 */

const ITEM_EMOJIS = ["🧁", "⭐", "🎈", "🍰", "🎁", "🌟"];

export default function Quiz({ onContinue, onPrevious }) {
  const [found, setFound] = useState(false);
  const [message, setMessage] = useState(
    "Click anywhere in the scene to search for the hidden item."
  );
  const [hiddenItem, setHiddenItem] = useState("🧁");
  const [hiddenPos, setHiddenPos] = useState({ x: 50, y: 50 }); // percents
  const [attempts, setAttempts] = useState(0);
  const [lastDistance, setLastDistance] = useState(null);
  const sceneRef = useRef(null);

  // Place the hidden item randomly on mount (and when user reloads component)
  useEffect(() => {
    placeNewHiddenItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function placeNewHiddenItem() {
    const margin = 8; // percent margin so it's not too close to edges
    const x = Math.floor(Math.random() * (100 - margin * 2)) + margin;
    const y = Math.floor(Math.random() * (100 - margin * 2)) + margin;
    const emoji = ITEM_EMOJIS[Math.floor(Math.random() * ITEM_EMOJIS.length)];
    setHiddenPos({ x, y });
    setHiddenItem(emoji);
    setFound(false);
    setAttempts(0);
    setMessage("Click anywhere in the scene to search for the hidden item.");
    setLastDistance(null);
  }

  // Handle searching by clicking inside the scene
  const handleSceneClick = (e) => {
    if (!sceneRef.current || found) return;

    const rect = sceneRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const pctX = (clickX / rect.width) * 100;
    const pctY = (clickY / rect.height) * 100;

    // convert percent delta to approximate pixel distance using container diagonal scale
    const dxPct = pctX - hiddenPos.x;
    const dyPct = pctY - hiddenPos.y;

    // approximate px distance relative to container size:
    const dxPx = (dxPct / 100) * rect.width;
    const dyPx = (dyPct / 100) * rect.height;
    const dist = Math.sqrt(dxPx * dxPx + dyPx * dyPx);
    setLastDistance(Math.round(dist));
    setAttempts((a) => a + 1);

    // threshold to "find" - about 8% of width (scaled to pixels)
    const thresholdPx = Math.max(28, rect.width * 0.08);

    if (dist <= thresholdPx) {
      setFound(true);
      setMessage(`You found it! ${hiddenItem} — great job 🎉`);
    } else if (dist <= thresholdPx * 2) {
      setMessage("Very close! Try a nearby spot.");
    } else if (dist <= thresholdPx * 4) {
      setMessage("Close! Keep searching around that area.");
    } else {
      setMessage("Nope — try a different spot.");
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white overflow-hidden px-4">
      <Snowfall color="white" snowflakeCount={100} />

      <h2
        className="text-3xl md:text-4xl font-bold mb-4 text-center"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        The Birthday Hunt
      </h2>

      <p
        className="mb-6 text-center text-lg md:text-xl px-2"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Find the tiny hidden item in the scene. Click anywhere in the scene to
        search hints appear after each click.
      </p>

      {/* Scene */}
      <div
        ref={sceneRef}
        onClick={handleSceneClick}
        className="w-full max-w-3xl aspect-[16/9] rounded-2xl shadow-2xl mb-6 relative overflow-hidden cursor-crosshair"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)), url('')",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
        aria-label="Hunt scene — click to search"
      >
        {/* decorative shapes to keep a friendly illustrated feel */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute bg-pink-600/10 rounded-full"
            style={{ width: "200px", height: "200px", left: "6%", top: "8%" }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bg-yellow-200/6 rounded-full"
            style={{ width: "260px", height: "260px", right: "6%", top: "6%" }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bg-white/4 rounded-xl"
            style={{ width: "120px", height: "140px", left: "12%", bottom: "10%" }}
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* If found, show the item at its hidden position */}
        {found && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.05, rotate: [0, -5, 0, 5, 0] }}
            transition={{
              // rotate uses a keyframes/tween-style transition (supports multiple values)
              rotate: { duration: 1.2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
              // keep scale as a spring for a bouncy pop
              scale: { type: "spring", stiffness: 220, damping: 14 },
            }}
            style={{
              position: "absolute",
              left: `${hiddenPos.x}%`,
              top: `${hiddenPos.y}%`,
              transform: "translate(-50%,-50%)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            <div className="text-4xl drop-shadow-lg">{hiddenItem}</div>
          </motion.div>
        )}

        {/* subtle marker of cursor when hovering */}
        <div
          style={{
            position: "absolute",
            right: 12,
            bottom: 12,
            zIndex: 20,
            pointerEvents: "none",
            opacity: 0.8,
          }}
          className="text-xs text-white/70 bg-black/20 px-3 py-1 rounded-full"
        >
          Attempts: {attempts}
        </div>
      </div>

      {/* Message area (clear how to play + live feedback) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 text-center text-lg md:text-xl px-3 text-yellow-300"
      >
        {message}
        {lastDistance !== null && !found ? (
          <div className="text-sm text-white/70 mt-1">Last distance: {lastDistance}px</div>
        ) : null}
      </motion.div>

      {/* Controls */}
      <div className="mt-4 flex gap-6">
        <motion.button
          onClick={onPrevious}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full text-lg font-bold shadow-md"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Previous
        </motion.button>

        {!found ? (
          <motion.button
            onClick={() => {
              // small convenience: reposition the hidden item if user wants a new challenge
              placeNewHiddenItem();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full text-lg font-bold shadow-lg"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            New Spot
          </motion.button>
        ) : (
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-red-700 hover:bg-red-600 rounded-full text-lg font-bold shadow-lg"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Continue
          </motion.button>
        )}
      </div>
    </div>
  );
}