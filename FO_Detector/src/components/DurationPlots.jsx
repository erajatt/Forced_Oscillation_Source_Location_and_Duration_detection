import React, { useState } from "react";
import { usePlotContext } from "../context/PlotContext";
import PlotCard from "./PlotCard";
import TimingCard from "./TImingCard";

const plotTypes = [
  { id: "original", title: "Original Signal" },
  { id: "detrended", title: "Detrended Signal" },
  { id: "filtered", title: "Filtered Signal" },
  { id: "cwt", title: "CWT Power Analysis" },
];

const DurationPlots = () => {
  const { startTime, endTime, duration, plots, isDetecting } = usePlotContext();
  const [activePlot, setActivePlot] = useState("original");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <TimingCard
          title="Start Time"
          value={startTime}
          isLoading={isDetecting}
          color="blue"
        />
        <TimingCard
          title="End Time"
          value={endTime}
          isLoading={isDetecting}
          color="red"
        />
        <TimingCard
          title="Duration"
          value={duration}
          isLoading={isDetecting}
          color="green"
        />
      </div>

      <div className="flex gap-6">
        {/* Sidebar with plot selection buttons */}
        <div className="w-48 space-y-2">
          {plotTypes.map((plot) => (
            <button
              key={plot.id}
              className={`w-full px-4 py-2 text-left rounded-lg transition-colors duration-200 
                ${
                  activePlot === plot.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => setActivePlot(plot.id)}
            >
              {plot.title}
            </button>
          ))}
        </div>

        {/* Main plot display area */}
        <div className="flex-1">
          <PlotCard
            title={plotTypes.find((p) => p.id === activePlot)?.title || ""}
            plot={plots[activePlot]}
            isLoading={isDetecting}
          />
        </div>
      </div>
    </div>
  );
};

export default DurationPlots;
