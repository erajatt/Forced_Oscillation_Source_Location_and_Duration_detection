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
} from "recharts"; // Importing components from recharts
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

  const CustomizedDot = (props) => {
    const { cx, cy } = props;
    if (props.isActive) {
      return <circle cx={cx} cy={cy} r={4} fill={props.stroke} />;
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
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
              name={`${gen} ${propertyLabelMap[prop]}`}
              dot={<CustomizedDot />}
              activeDot={{ r: 6 }}
            />
          ))
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DataChart;
