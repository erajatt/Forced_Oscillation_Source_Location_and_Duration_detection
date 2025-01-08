// api.js
import {
  FRONTEND_TO_BACKEND_MAP,
  BACKEND_TO_FRONTEND_MAP,
} from "../utils/constants";

// Utility function to transform API response data
const transformResponseData = (jsonData) => {
  return jsonData.map((item) => {
    const newItem = { ...item };
    Object.keys(item).forEach((key) => {
      const genMatch = key.match(/^G\d+/);
      if (genMatch) {
        const backendGen = genMatch[0];
        const frontendGen = BACKEND_TO_FRONTEND_MAP[backendGen];
        if (frontendGen) {
          const newKey = key.replace(backendGen, frontendGen);
          newItem[newKey] = item[key];
          delete newItem[key];
        }
      }
    });
    return newItem;
  });
};

export const handleConfirm = async (
  fileId,
  selectedGenerators,
  selectedProperties,
  callbacks
) => {
  const {
    setIsAnalyzing,
    setError,
    setShowSource,
    setShowDurationPlots,
    setShowChart,
    setData,
  } = callbacks;

  if (!fileId) {
    setError("No file selected. Please upload a file first.");
    return;
  }

  setIsAnalyzing(true);
  setError(null);
  setShowSource(false);
  setShowDurationPlots(false);
  setShowChart(true);

  const backendGenerators = selectedGenerators.map(
    (gen) => FRONTEND_TO_BACKEND_MAP[gen]
  );

  try {
    const response = await fetch(
      `https://forced-oscillation-source-location-and.onrender.com/api/analyze/${fileId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generators: backendGenerators,
          properties: selectedProperties,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to analyze data");
    }

    const jsonData = await response.json();
    const transformedData = transformResponseData(jsonData);
    setData(transformedData);
  } catch (error) {
    console.error("Error analyzing data:", error);
    setError(error.message);
  } finally {
    setIsAnalyzing(false);
  }
};

export const handleLocateSource = async (fileId, callbacks) => {
  const {
    setIsLocating,
    setError,
    setSourceResult,
    setShowChart,
    setShowDurationPlots,
    setShowSource,
  } = callbacks;

  if (!fileId) {
    setError("No file selected. Please upload a file first.");
    return;
  }

  setIsLocating(true);
  setError(null);
  setSourceResult(null);
  setShowChart(false);
  setShowDurationPlots(false);
  setShowSource(true);

  try {
    const response = await fetch(`https://forced-oscillation-source-location-and.onrender.com/api/locate_source`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to locate source");
    }

    const result = await response.json();
    const frontendGen = BACKEND_TO_FRONTEND_MAP[`G${result.predicted_source}`];

    setSourceResult({
      ...result,
      predicted_source: frontendGen,
    });
  } catch (error) {
    console.error("Error locating source:", error);
    setError(error.message);
  } finally {
    setIsLocating(false);
  }
};

export const handlePredictClass = async (fileId, callbacks) => {
  const {
    setIsPredicting,
    setError,
    setPredictedClass,
    setShowChart,
    setShowDurationPlots,
    setShowSource,
    setShowClass,
  } = callbacks;

  if (!fileId) {
    setError("No file selected. Please upload a file first.");
    return;
  }

  setIsPredicting(true);
  setError(null);
  // setSourceResult(null);
  setShowChart(false);
  setShowDurationPlots(false);
  setShowSource(false);
  setShowClass(true);

  try {
    const response = await fetch(`https://forced-oscillation-source-location-and.onrender.com/api/predict_class`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to locate source");
    }

    const result = await response.json();
    setPredictedClass(result["Predicted class"]);
  } catch (error) {
    console.error("Error Predicting source:", error);
    setError(error.message);
  } finally {
    setIsPredicting(false);
  }
};

export const handleDetectStartTime = async (fileId, callbacks) => {
  const {
    setIsDetecting,
    setError,
    setStartTime,
    setEndTime,
    setDuration,
    setPlots,
    setShowChart,
    setShowSource,
    setShowDurationPlots,
    setShowClass,
  } = callbacks;

  if (!fileId) {
    setError("No file selected. Please upload a file first.");
    return;
  }

  setIsDetecting(true);
  setError(null);
  setStartTime(null);
  setEndTime(null);
  setDuration(null);
  setPlots({
    original: null,
    detrended: null,
    filtered: null,
    cwt: null,
  });
  setShowChart(false);
  setShowSource(false);
  setShowClass(false);
  setShowDurationPlots(true);

  try {
    const response = await fetch(`https://forced-oscillation-source-location-and.onrender.com/api/detect_duration`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to detect oscillation");
    }

    const result = await response.json();

    // Set timing data
    setStartTime(result.start_time);
    setEndTime(result.end_time);
    setDuration(result.duration);

    // Set plot images
    setPlots({
      original: `data:image/png;base64,${result.original_signal}`,
      detrended: `data:image/png;base64,${result.detrended_signal}`,
      filtered: `data:image/png;base64,${result.filtered_signal}`,
      cwt: `data:image/png;base64,${result.cwt_power_with_anomalies}`,
    });
  } catch (error) {
    console.error("Error detecting oscillation:", error);
    setError(error.message);
  } finally {
    setIsDetecting(false);
  }
};

// Custom hook to get all the callback functions needed for API calls
export const useApiCallbacks = () => {
  const {
    setIsAnalyzing,
    setIsLocating,
    setIsDetecting,
    setError,
    setSourceResult,
    setShowChart,
    setShowDurationPlots,
    setShowSource,
    setStartTime,
    setEndTime,
    setDuration,
    setPlots,
    setData,
  } = usePlotContext();

  return {
    setIsAnalyzing,
    setIsLocating,
    setIsDetecting,
    setError,
    setSourceResult,
    setShowChart,
    setShowDurationPlots,
    setShowSource,
    setStartTime,
    setEndTime,
    setDuration,
    setPlots,
    setData,
  };
};

// Helper hook to bind API handlers with current context
export const useApiHandlers = (fileId) => {
  const callbacks = useApiCallbacks();
  const { selectedGenerators, selectedProperties } = usePlotContext();

  return {
    handleConfirm: () =>
      handleConfirm(fileId, selectedGenerators, selectedProperties, callbacks),
    handleLocateSource: () => handleLocateSource(fileId, callbacks),
    handleDetectStartTime: () => handleDetectStartTime(fileId, callbacks),
  };
};
