import React from "react";
import { Clock } from "lucide-react";

const TimingCard = ({ title, value, isLoading, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex items-center space-x-2">
        <Clock className={`w-5 h-5 text-${color}-500`} />
        <span className="text-xl font-bold">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />
          ) : value ? (
            `${value.toFixed(2)}s`
          ) : (
            "N/A"
          )}
        </span>
      </div>
    </div>
  );
};

export default TimingCard;
