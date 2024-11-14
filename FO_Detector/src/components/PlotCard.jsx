import React from "react";

const PlotCard = ({ title, plot, isLoading }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-full overflow-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      {isLoading ? (
        <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
      ) : plot ? (
        <img src={plot} alt={title} className="w-full rounded-lg" />
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
          No plot available
        </div>
      )}
    </div>
  );
};

export default PlotCard;
