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
