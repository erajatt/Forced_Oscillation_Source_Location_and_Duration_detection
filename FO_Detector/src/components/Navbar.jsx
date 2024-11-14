import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-white font-sans">
            FO<span className="text-yellow-300">Locator</span>
          </h1>
        </motion.div>

        {/* Navigation Links */}
        {/* <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex space-x-6"
        >
          <Link
            to="/"
            className="text-white hover:text-yellow-300 transition duration-300 ease-in-out text-lg"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-yellow-300 transition duration-300 ease-in-out text-lg"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-yellow-300 transition duration-300 ease-in-out text-lg"
          >
            Contact
          </Link>
        </motion.div> */}
      </div>
    </nav>
  );
};

export default Navbar;
