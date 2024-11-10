import React from "react";
import { usePlotContext } from "../context/PlotContext";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import SourceDisplay from "./SourceDisplay";
import DataChart from "./Datachart";
import DurationPlots from "./DurationPlots";

const MainPlotContent = () => {
  const {
    isAnalyzing,
    isLocating,
    isDetecting,
    error,
    showSource,
    sourceResult,
    showChart,
    showDurationPlots,
  } = usePlotContext();

  const renderContent = () => {
    if (isAnalyzing || isLocating || isDetecting) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (showSource && sourceResult) {
      return <SourceDisplay source={sourceResult} />;
    }

    if (showChart) {
      return <DataChart />;
    }

    if (showDurationPlots) {
      return <DurationPlots />;
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select options and click Plot to view data
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-grow p-8"
    >
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 font-serif">
        Data Visualization
      </h2>
      <div
        className="bg-white rounded-lg shadow-xl p-6"
        style={{ height: "600px" }}
      >
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default MainPlotContent;
