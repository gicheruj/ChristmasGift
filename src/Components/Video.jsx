// src/Components/Video.jsx
import React from "react";
import { motion } from "framer-motion";
import Snowfall from "react-snowfall";
import videoFile from "../assets/video.mp4";

const Video = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0f1c] via-[#0d1522] to-[#0a0f1c] text-white overflow-hidden">
      <Snowfall color="white" snowflakeCount={90} />

      {/* Glow Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 2 }}
        className="absolute w-[80%] max-w-3xl h-[60%] bg-amber-300/10 blur-[90px] rounded-full"
      />

      <div className="relative z-20 w-full max-w-3xl px-6 py-10 flex flex-col items-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
          style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        >
          A Special Message Just For You 🎁✨
        </motion.h2>

        {/* Video Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full bg-black/40 rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm"
        >
          <video
            src={videoFile}
            controls
            className="w-full h-auto rounded-2xl"
          />
        </motion.div>

        {/* Heartfelt Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-6 text-center text-lg text-gray-200 max-w-2xl leading-relaxed"
        >
          I hope this little journey brought a smile to your face.  
          You matter so much  more than words can ever say.  
          Here’s a message from the heart… just for you. ❤️
        </motion.p>
      </div>
    </div>
  );
};

export default Video;
