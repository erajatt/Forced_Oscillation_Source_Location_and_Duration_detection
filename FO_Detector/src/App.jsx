import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Plot from "./pages/Plot";
import RealTimeAnalysis from "./pages/RealTimeAnalysis";
import Footer from "./components/Footer";
import { PlotProvider } from './context/PlotContext';

function App() {
  return (
    <PlotProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plot" element={<Plot />} />
          <Route path="/realtime" element={<RealTimeAnalysis />} />
        </Routes>
        <Footer class="mt-2" />
      </Router>
    </PlotProvider>
  );
}

export default App;
