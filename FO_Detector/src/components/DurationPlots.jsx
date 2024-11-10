import React from "react";
import { usePlotContext } from "../context/PlotContext";
import PlotCard from "./PlotCard";
import TimingCard from "./TImingCard";

const DurationPlots = () => {
  const { startTime, endTime, duration, plots, isDetecting } = usePlotContext();

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlotCard
          title="Original Signal"
          plot={plots.original}
          isLoading={isDetecting}
        />
        <PlotCard
          title="Detrended Signal"
          plot={plots.detrended}
          isLoading={isDetecting}
        />
        <PlotCard
          title="Filtered Signal"
          plot={plots.filtered}
          isLoading={isDetecting}
        />
        <PlotCard
          title="CWT Power Analysis"
          plot={plots.cwt}
          isLoading={isDetecting}
        />
      </div>
    </div>
  );
};

export default DurationPlots;
