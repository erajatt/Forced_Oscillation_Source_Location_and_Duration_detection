import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import generatorBusGrid from "../assets/Grid_images/basecase.png";

const Home = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "text/csv" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setFile(selectedFile);
    } else {
      alert("Please select a CSV or XLSX file");
    }
  };

  const handleStartAnalysis = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "File upload failed");
      }

      const result = await response.json();
      navigate("/plot", { state: { fileId: result.file_id } });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Main content container */}
      <div className="h-full w-full flex items-center justify-center px-6">
        <div className="flex flex-row gap-8 items-center justify-center w-full max-w-7xl">
          {/* Left Column - Generator Bus Grid Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
              Eastern Regional Grid
            </h3>
            <div className="relative">
              <img
                src={generatorBusGrid}
                alt="Generator Bus Grid"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </motion.div>

          {/* Right Column - File Upload Section */}
          <div className="w-1/2 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6"
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Welcome to FO Locator
              </h2>
              <p className="text-lg text-slate-600">
                Upload your file to begin analysis
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg inline-block transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-sm"
              >
                Choose File
              </label>
              {file && (
                <p className="mt-3 text-sm text-slate-600">
                  Selected file: {file.name}
                </p>
              )}

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <button
                    onClick={handleStartAnalysis}
                    disabled={isUploading}
                    className={`w-full bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-sm ${
                      isUploading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-emerald-700"
                    }`}
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Plot and visualize data"
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
