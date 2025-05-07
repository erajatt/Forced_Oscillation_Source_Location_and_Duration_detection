import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { usePlotContext } from "../context/PlotContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { BACKEND_TO_FRONTEND_MAP } from "../utils/constants";
import { CloudIcon, BoltIcon, MapPinIcon, CheckCircleIcon } from "@heroicons/react/24/outline";


const RealTimeAnalysis = () => {
  const location = useLocation();
  const fileId = location.state?.fileId;
  const [currentChunk, setCurrentChunk] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('collecting'); // collecting, predicting, locating
  const [predictionResult, setPredictionResult] = useState('');
  const [sourceResult, setSourceResult] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [dataPoints, setDataPoints] = useState([]);

  const {
    setError,
    error,
  } = usePlotContext();

  // Generate realistic fluctuating data points
  const generateDataPoints = () => {
    const newPoints = [];
    const baseValue = Math.random() * 50 + 50;
    
    for (let i = 0; i < 20; i++) {
      newPoints.push({
        time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString(),
        value: baseValue + Math.random() * 20 - 10
      });
    }
    
    return newPoints;
  };

  // Update data points with new values
  const updateDataPoints = () => {
    setDataPoints(prevPoints => {
      const newPoints = [...prevPoints];
      if (newPoints.length >= 20) {
        newPoints.shift();
      }
      
      const lastValue = newPoints.length > 0 ? newPoints[newPoints.length - 1].value : Math.random() * 50 + 50;
      const newValue = lastValue + Math.random() * 10 - 5;
      
      newPoints.push({
        time: new Date().toLocaleTimeString(),
        value: Math.max(0, Math.min(100, newValue))
      });
      
      return newPoints;
    });
  };

  const simulateDataStreaming = async () => {
    try {
      setIsProcessing(true);
      setCurrentPhase('collecting');
      setDataPoints(generateDataPoints());
      
      // Start real-time data updates
      const dataInterval = setInterval(updateDataPoints, 1000);
      
      // Simulate cloud data collection animation with non-linear progress
      const progressSteps = [0, 5, 12, 18, 23, 29, 38, 45, 51, 58, 65, 72, 79, 85, 92, 97, 100];
      for (let i = 0; i < progressSteps.length; i++) {
        setProgress(progressSteps[i]);
        // Vary delay to make it look more realistic
        const delay = 300 + Math.random() * 400;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      
      // Pulse effect during prediction
      setCurrentPhase('predicting');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      
      clearInterval(dataInterval);
      
      // Predict class for the current chunk
      const predictResult = { 'Predicted class': Math.random() > 0.5 ? '1' : '0' };
      
      if(predictResult['Predicted class'] === '1') 
        setPredictionResult('Forced Oscillation');
      else
        setPredictionResult('Natural Oscillation');
      
      setShowResults(true);

      // Wait to show prediction result
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // If forced oscillation detected, locate source
      if (predictResult['Predicted class'] === '1') {
        setCurrentPhase('locating');
        
        await new Promise((resolve) => setTimeout(resolve, 5000));
        
        // Simulate source location result
        const sourceIndex = Math.floor(Math.random() * 6) + 1;
        const frontendGen = BACKEND_TO_FRONTEND_MAP[`G${sourceIndex}`] || `Generator ${sourceIndex}`;
        setSourceResult(frontendGen);
        
        // Wait to show source result
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }

      // Store results and move to next chunk
      setAnalysisResults(prev => [...prev, {
        chunk: currentChunk,
        prediction: predictionResult,
        source: sourceResult
      }]);

      // Reset for next chunk
      setShowResults(false);
      setPredictionResult('');
      setSourceResult('');
      setCurrentChunk(prev => prev + 1);
      
      // Short delay before starting next chunk
      await new Promise((resolve) => setTimeout(resolve, 1000));
      simulateDataStreaming();

    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (fileId) {
      simulateDataStreaming();
    }
    
    return () => {
      // Clean up any intervals/timers when component unmounts
      setIsProcessing(false);
    };
  }, [fileId]);

  const renderProgressBar = () => (
    <motion.div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
      <motion.div
        className="bg-indigo-600 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "easeInOut" }}
      />
    </motion.div>
  );

  const renderStatus = () => {
    const getStatusText = () => {
      switch (currentPhase) {
        case 'collecting':
          return `Streaming real-time data from cloud: ${progress}% complete`;
        case 'predicting':
          return 'Analyzing oscillation patterns...';
        case 'locating':
          return 'Locating oscillation source...';
        default:
          return '';
      }
    };

    const getStatusIcon = () => {
      switch (currentPhase) {
        case 'collecting':
          return <CloudIcon className="w-6 h-6 text-indigo-600 animate-pulse" />;
        case 'predicting':
          return <BoltIcon className="w-6 h-6 text-amber-500 animate-pulse" />;
        case 'locating':
          return <MapPinIcon className="w-6 h-6 text-red-500 animate-pulse" />;
        default:
          return null;
      }
    };

    return (
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4 font-serif">
          Live Data Processing
        </h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          {getStatusIcon()}
          <p className="text-gray-700 font-medium">{getStatusText()}</p>
        </div>
      </div>
    );
  };

  const renderLiveDataVisualization = () => {
    return (
      <div className="bg-black bg-opacity-5 rounded-lg p-4 mb-8">
        <div className="text-sm text-gray-500 mb-2 flex justify-between">
          <span>Signal Strength</span>
          <span>Live Feed</span>
        </div>
        <div className="h-32 relative">
          <div className="absolute inset-0">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.5)" />
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0.1)" />
                </linearGradient>
              </defs>
              
              {/* Background grid lines */}
              {[20, 40, 60, 80].map(y => (
                <line 
                  key={`grid-${y}`} 
                  x1="0" 
                  y1={y} 
                  x2="100" 
                  y2={y} 
                  stroke="#eee" 
                  strokeWidth="0.5"
                />
              ))}
              
              {/* Data line */}
              {dataPoints.length > 1 && (
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  d={`M ${dataPoints.map((point, i) => 
                    `${(i / (dataPoints.length - 1)) * 100} ${100 - point.value}`
                  ).join(' L ')}`}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              
              {/* Area under the curve */}
              {dataPoints.length > 1 && (
                <path
                  d={`
                    M ${dataPoints.map((point, i) => 
                      `${(i / (dataPoints.length - 1)) * 100} ${100 - point.value}`
                    ).join(' L ')} 
                    L 100 100 
                    L 0 100 Z
                  `}
                  fill="url(#gradient)"
                  opacity="0.5"
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (showResults) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {predictionResult && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <h4 className="text-lg font-semibold text-indigo-800">
                  Oscillation Analysis Result
                </h4>
              </div>
              <div className="bg-gray-50 p-4 rounded flex items-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`w-4 h-4 rounded-full mr-3 ${predictionResult === 'Forced Oscillation' ? 'bg-red-500' : 'bg-blue-500'}`}
                />
                <p className="text-lg">Type: <span className="font-semibold">{predictionResult}</span></p>
              </div>
            </div>
          )}
          
          {sourceResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 mt-4"
            >
              <div className="flex items-center mb-4">
                <MapPinIcon className="w-6 h-6 text-red-500 mr-2" />
                <h4 className="text-lg font-semibold text-indigo-800">
                  Source Location Result
                </h4>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-lg">Source: <span className="font-semibold">{sourceResult}</span></p>
              </div>
            </motion.div>
          )}
        </motion.div>
      );
    }

    return (
      <div className="space-y-6">
        <AnimatePresence>
          {analysisResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <h4 className="text-lg font-semibold text-indigo-800">
                  Analysis Result {index + 1}
                </h4>
              </div>
              <div className="bg-gray-50 p-4 rounded space-y-4">
                <div className="flex items-center">
                  <motion.div 
                    className={`w-3 h-3 rounded-full mr-3 ${result.prediction === 'Forced Oscillation' ? 'bg-red-500' : 'bg-blue-500'}`}
                  />
                  <p className="text-lg">Type: <span className="font-semibold">{result.prediction}</span></p>
                </div>
                {result.source && (
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-lg">Source: <span className="font-semibold">{result.source}</span></p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center mb-6">
          <motion.div
            animate={{ 
              rotate: isProcessing ? [0, 360] : 0,
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "linear"
            }}
            className="mr-3"
          >
            <CloudIcon className="w-8 h-8 text-indigo-600" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 font-serif">
            Real-Time Cloud Analysis
          </h2>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
          {isProcessing ? (
            <div className="space-y-6">
              {renderStatus()}
              {currentPhase === 'collecting' && renderProgressBar()}
              {renderLiveDataVisualization()}
              
              {(currentPhase === 'predicting' || currentPhase === 'locating') && (
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{
                      scale: 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <LoadingSpinner />
                  </motion.div>
                </div>
              )}
              
              {showResults && renderResults()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CloudIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Connection established. Waiting for data stream...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeAnalysis;