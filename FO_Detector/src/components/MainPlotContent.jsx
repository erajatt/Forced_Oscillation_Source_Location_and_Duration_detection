import React from "react";
import { usePlotContext } from "../context/PlotContext";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import SourceDisplay from "./SourceDisplay";
import DataChart from "./Datachart";
import DurationPlots from "./DurationPlots";
import ClassDisplay from "./ClassDisplay";

const MainPlotContent = () => {
  const {
    isAnalyzing,
    isLocating,
    isPredicting,
    setIsPredicting,
    setIsLocating,
    isDetecting,
    error,
    setError,
    showSource,
    setShowSource,
    sourceResult,
    setSourceResult,
    predictedClass,
    showChart,
    setShowChart,
    showDurationPlots,
    setShowDurationPlots,
    showClass,
    setShowClass,
  } = usePlotContext();

  const renderContent = () => {
    if (isAnalyzing || isLocating || isDetecting || isPredicting) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (showSource && sourceResult) {
      return <SourceDisplay source={sourceResult} />;
    }

    if (showChart) {
      return (
        <div className="h-[600px]">
          <DataChart />
        </div>
      );
    }

    if (showClass) {
      return (
        <div className="h-[600px]">
          <ClassDisplay
            class={predictedClass}
            setIsLocating={setIsLocating}
            setError={setError}
            setSourceResult={setSourceResult}
            setShowChart={setShowChart}
            setShowDurationPlots={setShowDurationPlots}
            setShowSource={setShowSource}
            setShowClass={setShowClass}
          />
        </div>
      );
    }

    if (showDurationPlots) {
      return (
        <div className="min-h-[600px]">
          <DurationPlots />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-[600px] text-gray-500">
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
      <div className="bg-white rounded-lg shadow-xl p-6 overflow-visible">
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default MainPlotContent;
