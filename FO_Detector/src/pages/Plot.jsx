// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useLocation } from "react-router-dom";
// import { Clock, AlertCircle } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // Import generator images
// import G2Image from "../assets/Grid_images/G2.png";
// import G5Image from "../assets/Grid_images/G5.png";
// import G7Image from "../assets/Grid_images/G7.png";
// import G22Image from "../assets/Grid_images/G22.png";
// import G23Image from "../assets/Grid_images/G23.png";
// import G4Image from "../assets/Grid_images/G4.png";
// import G6Image from "../assets/Grid_images/G6.png";
// import G14Image from "../assets/Grid_images/G14.png";
// import G15Image from "../assets/Grid_images/G15.png";
// import G16Image from "../assets/Grid_images/G16.png";

// // Frontend to Backend mapping (Display Name -> Backend Name)
// const FRONTEND_TO_BACKEND_MAP = {
//   G2: "G1",
//   G5: "G2",
//   G7: "G3",
//   G22: "G4",
//   G23: "G5",
//   G4: "G6",
//   G6: "G7",
//   G14: "G8",
//   G15: "G9",
//   G16: "G10",
// };

// // Backend to Frontend mapping (Backend Name -> Display Name)
// const BACKEND_TO_FRONTEND_MAP = {
//   G1: "G2",
//   G2: "G5",
//   G3: "G7",
//   G4: "G22",
//   G5: "G23",
//   G6: "G4",
//   G7: "G6",
//   G8: "G14",
//   G9: "G15",
//   G10: "G16",
// };

// // Image mapping for generators
// const GENERATOR_IMAGES = {
//   G2: G2Image,
//   G5: G5Image,
//   G7: G7Image,
//   G22: G22Image,
//   G23: G23Image,
//   G4: G4Image,
//   G6: G6Image,
//   G14: G14Image,
//   G15: G15Image,
//   G16: G16Image,
// };

// // List of display names for the frontend
// const DISPLAY_GENERATORS = Object.keys(FRONTEND_TO_BACKEND_MAP);

// const Plot = () => {
//   const [data, setData] = useState([]);
//   const [selectedGenerators, setSelectedGenerators] = useState([]);
//   const [selectedProperties, setSelectedProperties] = useState([]);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [isLocating, setIsLocating] = useState(false);
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [error, setError] = useState(null);
//   const [sourceResult, setSourceResult] = useState(null);
//   const [showChart, setShowChart] = useState(true);
//   const [showDurationPlots, setShowDurationPlots] = useState(false);
//   const [showSource, setShowSource] = useState(false);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [duration, setDuration] = useState(null);
//   const [plots, setPlots] = useState({
//     original: null,
//     detrended: null,
//     filtered: null,
//     cwt: null,
//   });
//   const location = useLocation();
//   const fileId = location.state?.fileId;

//   const propertyOptions = [
//     { label: "Power", value: "P" },
//     { label: "Reactive Power", value: "Q" },
//     { label: "Voltage Magnitude", value: "V" },
//     { label: "Voltage Angle", value: "A" },
//   ];

//   const propertyLabelMap = {
//     P: "Power",
//     Q: "Reactive Power",
//     V: "Voltage Magnitude",
//     A: "Voltage Angle",
//   };

//   const handleConfirm = async () => {
//     if (!fileId) {
//       setError("No file selected. Please upload a file first.");
//       return;
//     }
//     setIsAnalyzing(true);
//     setError(null);
//     setShowSource(false);
//     setShowDurationPlots(false);
//     setShowChart(true);

//     // Convert selected generators to backend format
//     const backendGenerators = selectedGenerators.map(
//       (gen) => FRONTEND_TO_BACKEND_MAP[gen]
//     );

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/api/analyze/${fileId}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             generators: backendGenerators,
//             properties: selectedProperties,
//           }),
//         }
//       );
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to analyze data");
//       }
//       const jsonData = await response.json();

//       // Transform the data to use frontend generator names
//       const transformedData = jsonData.map((item) => {
//         const newItem = { ...item };
//         Object.keys(item).forEach((key) => {
//           // Check if the key contains a generator name
//           const genMatch = key.match(/^G\d+/);
//           if (genMatch) {
//             const backendGen = genMatch[0];
//             const frontendGen = BACKEND_TO_FRONTEND_MAP[backendGen];
//             if (frontendGen) {
//               const newKey = key.replace(backendGen, frontendGen);
//               newItem[newKey] = item[key];
//               delete newItem[key];
//             }
//           }
//         });
//         return newItem;
//       });

//       setData(transformedData);
//     } catch (error) {
//       console.error("Error analyzing data:", error);
//       setError(error.message);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const handleDetectStartTime = async () => {
//     if (!fileId) {
//       setError("No file selected. Please upload a file first.");
//       return;
//     }
//     setIsDetecting(true);
//     setError(null);
//     setStartTime(null);
//     setEndTime(null);
//     setDuration(null);
//     setPlots({
//       original: null,
//       detrended: null,
//       filtered: null,
//       cwt: null,
//     });
//     setShowChart(false);
//     setShowSource(false);
//     setShowDurationPlots(true);

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/api/detect_duration`,
//         {
//           method: "GET",
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to detect oscillation");
//       }

//       const result = await response.json();

//       // Set timing data
//       setStartTime(result.start_time);
//       setEndTime(result.end_time);
//       setDuration(result.duration);

//       // Set plot images
//       setPlots({
//         original: `data:image/png;base64,${result.original_signal}`,
//         detrended: `data:image/png;base64,${result.detrended_signal}`,
//         filtered: `data:image/png;base64,${result.filtered_signal}`,
//         cwt: `data:image/png;base64,${result.cwt_power_with_anomalies}`,
//       });
//     } catch (error) {
//       console.error("Error detecting oscillation:", error);
//       setError(error.message);
//     } finally {
//       setIsDetecting(false);
//     }
//   };

//   const handleLocateSource = async () => {
//     if (!fileId) {
//       setError("No file selected. Please upload a file first.");
//       return;
//     }
//     setIsLocating(true);
//     setError(null);
//     setSourceResult(null);
//     setShowChart(false);
//     setShowDurationPlots(false);
//     setShowSource(true);

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/locate_source`, {
//         method: "GET",
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to locate source");
//       }
//       const result = await response.json();

//       // Convert backend generator number to frontend generator name
//       const frontendGen =
//         BACKEND_TO_FRONTEND_MAP[`G${result.predicted_source}`];
//       setSourceResult({
//         ...result,
//         predicted_source: frontendGen,
//       });
//     } catch (error) {
//       console.error("Error locating source:", error);
//       setError(error.message);
//     } finally {
//       setIsLocating(false);
//     }
//   };

//   const getColor = (index) => {
//     const colors = [
//       "#FF4500",
//       "#1E90FF",
//       "#32CD32",
//       "#FFD700",
//       "#8A2BE2",
//       "#DC143C",
//       "#FF8C00",
//       "#4682B4",
//       "#20B2AA",
//       "#9932CC",
//     ];
//     return colors[index % colors.length];
//   };

//   const CustomizedDot = (props) => {
//     const { cx, cy, payload, dataKey } = props;
//     if (props.isActive) {
//       return <circle cx={cx} cy={cy} r={4} fill={props.stroke} />;
//     }
//     return null;
//   };

//   const renderContent = () => {
//     if (isAnalyzing || isLocating || isDetecting) {
//       return (
//         <div className="flex items-center justify-center h-full">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             className="w-16 h-16 border-t-4 border-indigo-500 rounded-full"
//           ></motion.div>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="flex items-center justify-center h-full text-red-500">
//           Error: {error}
//         </div>
//       );
//     }

//     if (showSource && sourceResult) {
//       return (
//         <div className="flex flex-col items-center justify-center h-full">
//           <h3 className="text-2xl font-bold text-indigo-800 mb-4">
//             Source Generator: {sourceResult.predicted_source}
//           </h3>
//           <div className="relative w-full h-4/5">
//             <img
//               src={GENERATOR_IMAGES[sourceResult.predicted_source]}
//               alt={`Generator ${sourceResult.predicted_source}`}
//               className="object-contain w-full h-full"
//             />
//           </div>
//         </div>
//       );
//     }

//     if (data.length > 0 && showChart) {
//       return (
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="timestamp" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             {selectedGenerators.flatMap((gen, genIndex) =>
//               selectedProperties.map((prop, propIndex) => (
//                 <Line
//                   key={`${gen}-${prop}`}
//                   type="monotone"
//                   dataKey={`${gen}_${prop}`}
//                   stroke={getColor(
//                     genIndex * selectedProperties.length + propIndex
//                   )}
//                   name={`${gen} ${propertyLabelMap[prop]}`}
//                   dot={<CustomizedDot />}
//                   activeDot={{ r: 6 }}
//                 />
//               ))
//             )}
//           </LineChart>
//         </ResponsiveContainer>
//       );
//     }

//     if (showDurationPlots) {
//       return (
//         <div className="container mx-auto px-4 py-8">
//           {/* Timing Information */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//             {/* Start Time */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                 Start Time
//               </h3>
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-blue-500" />
//                 <span className="text-xl font-bold">
//                   {isDetecting ? (
//                     <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />
//                   ) : startTime ? (
//                     `${startTime.toFixed(2)}s`
//                   ) : (
//                     "N/A"
//                   )}
//                 </span>
//               </div>
//             </div>

//             {/* End Time */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                 End Time
//               </h3>
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-red-500" />
//                 <span className="text-xl font-bold">
//                   {isDetecting ? (
//                     <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />
//                   ) : endTime ? (
//                     `${endTime.toFixed(2)}s`
//                   ) : (
//                     "N/A"
//                   )}
//                 </span>
//               </div>
//             </div>

//             {/* Duration */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                 Duration
//               </h3>
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-green-500" />
//                 <span className="text-xl font-bold">
//                   {isDetecting ? (
//                     <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />
//                   ) : duration ? (
//                     `${duration.toFixed(2)}s`
//                   ) : (
//                     "N/A"
//                   )}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Plots Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Original Signal */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                 Original Signal
//               </h3>
//               {isDetecting ? (
//                 <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
//               ) : plots.original ? (
//                 <img
//                   src={plots.original}
//                   alt="Original Signal"
//                   className="w-full rounded-lg"
//                 />
//               ) : (
//                 <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
//                   No plot available
//                 </div>
//               )}
//             </div>

//             {/* Detrended Signal */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                 Detrended Signal
//               </h3>
//               {isDetecting ? (
//                 <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
//               ) : plots.detrended ? (
//                 <img
//                   src={plots.detrended}
//                   alt="Detrended Signal"
//                   className="w-full rounded-lg"
//                 />
//               ) : (
//                 <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
//                   No plot available
//                 </div>
//               )}
//             </div>

//             {/* Filtered Signal */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                 Filtered Signal
//               </h3>
//               {isDetecting ? (
//                 <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
//               ) : plots.filtered ? (
//                 <img
//                   src={plots.filtered}
//                   alt="Filtered Signal"
//                   className="w-full rounded-lg"
//                 />
//               ) : (
//                 <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
//                   No plot available
//                 </div>
//               )}
//             </div>

//             {/* CWT Power Plot */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                 CWT Power Analysis
//               </h3>
//               {isDetecting ? (
//                 <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
//               ) : plots.cwt ? (
//                 <img
//                   src={plots.cwt}
//                   alt="CWT Power Analysis"
//                   className="w-full rounded-lg"
//                 />
//               ) : (
//                 <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
//                   No plot available
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center justify-center h-full text-gray-500">
//         Select options and click Plot to view data
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200 flex">
//       {/* Sidebar */}
//       <motion.div
//         initial={{ x: -250 }}
//         animate={{ x: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-64 bg-white shadow-lg p-6 space-y-6 overflow-y-auto"
//       >
//         {/* Generator selection */}
//         <div>
//           <h3 className="text-lg font-semibold text-indigo-800 mb-2">
//             Generators
//           </h3>
//           {DISPLAY_GENERATORS.map((gen) => (
//             <label key={gen} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={selectedGenerators.includes(gen)}
//                 onChange={() =>
//                   setSelectedGenerators((prev) =>
//                     prev.includes(gen)
//                       ? prev.filter((s) => s !== gen)
//                       : [...prev, gen]
//                   )
//                 }
//                 className="form-checkbox h-5 w-5 text-indigo-600"
//               />
//               <span className="ml-2 text-gray-700">{gen}</span>
//             </label>
//           ))}
//         </div>
//         {/* Property selection */}
//         <div>
//           <h3 className="text-lg font-semibold text-indigo-800 mb-2">
//             Properties
//           </h3>
//           {propertyOptions.map((prop) => (
//             <label key={prop.value} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={selectedProperties.includes(prop.value)}
//                 onChange={() =>
//                   setSelectedProperties((prev) =>
//                     prev.includes(prop.value)
//                       ? prev.filter((p) => p !== prop.value)
//                       : [...prev, prop.value]
//                   )
//                 }
//                 className="form-checkbox h-5 w-5 text-indigo-600"
//               />
//               <span className="ml-2 text-gray-700">{prop.label}</span>
//             </label>
//           ))}
//         </div>
//         {/* Action buttons */}
//         <button
//           onClick={handleConfirm}
//           disabled={isAnalyzing}
//           className={`w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 ${
//             isAnalyzing
//               ? "opacity-50 cursor-not-allowed"
//               : "hover:bg-indigo-600"
//           }`}
//         >
//           {isAnalyzing ? "Analyzing..." : "Plot"}
//         </button>

//         <button
//           onClick={handleLocateSource}
//           disabled={isLocating}
//           className={`w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 ${
//             isLocating ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"
//           }`}
//         >
//           {isLocating ? "Locating..." : "Locate Source"}
//         </button>

//         <button
//           onClick={handleDetectStartTime}
//           disabled={isDetecting}
//           className={`w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 ${
//             isDetecting
//               ? "opacity-50 cursor-not-allowed"
//               : "hover:bg-indigo-600"
//           }`}
//         >
//           {isDetecting ? "Detecting..." : "Detect Start time"}
//         </button>
//       </motion.div>

//       {/* Main content area */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex-grow p-8"
//       >
//         <h2 className="text-3xl font-bold text-indigo-800 mb-6 font-serif">
//           Data Visualization
//         </h2>
//         <div
//           className="bg-white rounded-lg shadow-xl p-6"
//           style={{ height: "600px" }}
//         >
//           {renderContent()}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Plot;

import { PlotProvider } from "../context/PlotContext";
import Sidebar from "../components/Sidebar";
import MainPlotContent from "../components/MainPlotContent";

const Plot = () => {
  return (
    <PlotProvider>
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200 flex">
        <Sidebar />
        <MainPlotContent />
      </div>
    </PlotProvider>
  );
};

export default Plot;
