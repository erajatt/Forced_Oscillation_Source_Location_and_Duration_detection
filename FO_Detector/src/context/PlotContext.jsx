import React, { createContext, useContext, useState } from "react";

const PlotContext = createContext();

export const PlotProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [selectedGenerators, setSelectedGenerators] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [sourceResult, setSourceResult] = useState(null);
  const [predictedClass, setPredictedClass] = useState(null);
  const [showChart, setShowChart] = useState(true);
  const [showDurationPlots, setShowDurationPlots] = useState(false);
  const [showClass, setShowClass] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [plots, setPlots] = useState({
    original: null,
    detrended: null,
    filtered: null,
    cwt: null,
  });

  return (
    <PlotContext.Provider
      value={{
        data,
        setData,
        selectedGenerators,
        setSelectedGenerators,
        selectedProperties,
        setSelectedProperties,
        isAnalyzing,
        setIsAnalyzing,
        isPredicting,
        setIsPredicting,
        isLocating,
        setIsLocating,
        isDetecting,
        setIsDetecting,
        error,
        setError,
        sourceResult,
        setSourceResult,
        predictedClass,
        setPredictedClass,
        showChart,
        setShowChart,
        showDurationPlots,
        setShowDurationPlots,
        showClass,
        setShowClass,
        showSource,
        setShowSource,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        duration,
        setDuration,
        plots,
        setPlots,
      }}
    >
      {children}
    </PlotContext.Provider>
  );
};

export const usePlotContext = () => useContext(PlotContext);
