import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-t-4 border-indigo-500 rounded-full"
      ></motion.div>
    </div>
  );
};

export default LoadingSpinner;
