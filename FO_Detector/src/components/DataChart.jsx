import React from "react";
import { usePlotContext } from "../context/PlotContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { propertyLabelMap } from "../utils/constants";

const DataChart = () => {
  const { data, selectedGenerators, selectedProperties } = usePlotContext();

  const getColor = (index) => {
    const colors = [
      "#FF4500",
      "#1E90FF",
      "#32CD32",
      "#FFD700",
      "#8A2BE2",
      "#DC143C",
      "#FF8C00",
      "#4682B4",
      "#20B2AA",
      "#9932CC",
    ];
    return colors[index % colors.length];
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {selectedGenerators.flatMap((gen, genIndex) =>
            selectedProperties.map((prop, propIndex) => (
              <Line
                key={`${gen}-${prop}`}
                type="monotone"
                dataKey={`${gen}_${prop}`}
                stroke={getColor(
                  genIndex * selectedProperties.length + propIndex
                )}
                name={`${gen} ${propertyLabelMap[prop] || prop}`}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChart;
