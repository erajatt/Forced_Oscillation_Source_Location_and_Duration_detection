// ActionButtons.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { usePlotContext } from "../context/PlotContext";
import {
  handleConfirm,
  handleDetectStartTime,
  // handleLocateSource,
  handlePredictClass,
} from "../api";

const ActionButtons = () => {
  const location = useLocation();
  const fileId = location.state?.fileId;

  const {
    isAnalyzing,
    setIsAnalyzing,
    isPredicting,
    setIsPredicting,
    isLocating,
    setIsLocating,
    isDetecting,
    setIsDetecting,
    setError,
    setShowClass,
    setShowSource,
    setShowDurationPlots,
    setShowChart,
    setData,
    setSourceResult,
    setPredictedClass,
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
      setShowClass,
      setData,
    });
  };

  const handlePredictClick = async () => {
    await handlePredictClass(fileId, {
      setIsPredicting,
      setError,
      // setSourceResult,
      setPredictedClass,
      setShowChart,
      setShowDurationPlots,
      setShowSource,
      setShowClass,
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
      setShowClass,
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

      <button
        onClick={handlePredictClick}
        disabled={isPredicting}
        className={`
          w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md 
          transition duration-300 ease-in-out transform hover:scale-105
          ${
            isPredicting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-600"
          }
        `}
      >
        {isPredicting ? "Predicting..." : "Predict Oscillation type"}
      </button>
    </div>
  );
};

export default ActionButtons;
