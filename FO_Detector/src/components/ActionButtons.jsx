// ActionButtons.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { usePlotContext } from "../context/PlotContext";
import {
  handleConfirm,
  handleDetectStartTime,
  handleLocateSource,
} from "../api";

const ActionButtons = () => {
  const location = useLocation();
  const fileId = location.state?.fileId;

  const {
    isAnalyzing,
    setIsAnalyzing,
    isLocating,
    setIsLocating,
    isDetecting,
    setIsDetecting,
    setError,
    setShowSource,
    setShowDurationPlots,
    setShowChart,
    setData,
    setSourceResult,
    setStartTime,
    setEndTime,
    setDuration,
    setPlots,
    selectedGenerators,
    selectedProperties,
  } = usePlotContext();

  const handlePlotClick = async () => {
    await handleConfirm(fileId, selectedGenerators, selectedProperties, {
      setIsAnalyzing,
      setError,
      setShowSource,
      setShowDurationPlots,
      setShowChart,
      setData,
    });
  };

  const handleLocateClick = async () => {
    await handleLocateSource(fileId, {
      setIsLocating,
      setError,
      setSourceResult,
      setShowChart,
      setShowDurationPlots,
      setShowSource,
    });
  };

  const handleDetectClick = async () => {
    await handleDetectStartTime(fileId, {
      setIsDetecting,
      setError,
      setStartTime,
      setEndTime,
      setDuration,
      setPlots,
      setShowChart,
      setShowSource,
      setShowDurationPlots,
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePlotClick}
        disabled={isAnalyzing}
        className={`
          w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md 
          transition duration-300 ease-in-out transform hover:scale-105
          ${
            isAnalyzing
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-600"
          }
        `}
      >
        {isAnalyzing ? "Analyzing..." : "Plot"}
      </button>

      <button
        onClick={handleLocateClick}
        disabled={isLocating}
        className={`
          w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md 
          transition duration-300 ease-in-out transform hover:scale-105
          ${
            isLocating ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"
          }
        `}
      >
        {isLocating ? "Locating..." : "Locate Source"}
      </button>

      <button
        onClick={handleDetectClick}
        disabled={isDetecting}
        className={`
          w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md 
          transition duration-300 ease-in-out transform hover:scale-105
          ${
            isDetecting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-600"
          }
        `}
      >
        {isDetecting ? "Detecting..." : "Detect Start time"}
      </button>
    </div>
  );
};

export default ActionButtons;
