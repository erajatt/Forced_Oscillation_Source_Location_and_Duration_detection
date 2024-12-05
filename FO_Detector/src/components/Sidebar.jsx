import React from "react";
import { motion } from "framer-motion";
import { usePlotContext } from "../context/PlotContext";
import ActionButtons from "./ActionButtons";
import { DISPLAY_GENERATORS } from "../utils/constants";
import { propertyOptions } from "../utils/constants";

const Sidebar = () => {
  const {
    selectedGenerators,
    setSelectedGenerators,
    selectedProperties,
    setSelectedProperties,
    isAnalyzing,
    isLocating,
    isDetecting,
  } = usePlotContext();

  const handleGeneratorChange = (gen) => {
    setSelectedGenerators((prev) =>
      prev.includes(gen) ? prev.filter((s) => s !== gen) : [...prev, gen]
    );
  };

  const handlePropertyChange = (value) => {
    setSelectedProperties((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white p-6 space-y-6 overflow-y-auto mb-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">
          Generators
        </h3>
        {DISPLAY_GENERATORS.map((gen) => (
          <label key={gen} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedGenerators.includes(gen)}
              onChange={() => handleGeneratorChange(gen)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-gray-700">{gen}</span>
          </label>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">
          Properties
        </h3>
        {propertyOptions.map((prop) => (
          <label key={prop.value} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedProperties.includes(prop.value)}
              onChange={() => handlePropertyChange(prop.value)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-gray-700">{prop.label}</span>
          </label>
        ))}
      </div>
      <ActionButtons />
    </motion.div>
  );
};

export default Sidebar;
