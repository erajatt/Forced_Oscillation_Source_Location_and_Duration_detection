import React from "react";
import { handleLocateSource } from "../api";
import { useLocation } from "react-router-dom";

const ClassDisplay = ({
  class: predictedClass,
  setIsLocating,
  setError,
  setSourceResult,
  setShowChart,
  setShowDurationPlots,
  setShowSource,
  setShowClass,
}) => {
  // Map the predicted class to a label
  const classLabel =
    predictedClass === "0" ? "Natural Oscillation" : "Forced Oscillation";
  const location = useLocation();
  const fileId = location.state?.fileId;

  const handleLocateClick = async () => {
    try {
      setIsLocating(true); // Indicate locating process has started
      await handleLocateSource(fileId, {
        setIsLocating,
        setError,
        setSourceResult,
        setShowChart,
        setShowDurationPlots,
        setShowSource,
        setShowClass,
      });
    } catch (err) {
      setError(err.message || "Error locating the source");
    } finally {
      setIsLocating(false); // Indicate locating process has ended
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800">Predicted Class</h1>
      <p className="mt-4 text-lg text-gray-600">
        The system's oscillation is classified as:
      </p>
      <div
        className={`mt-4 px-6 py-3 rounded-full text-white font-semibold ${
          predictedClass === "0" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {classLabel}
      </div>

      {predictedClass === "1" && (
        <button
          className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={handleLocateClick}
        >
          Locate Source
        </button>
      )}
    </div>
  );
};

export default ClassDisplay;
