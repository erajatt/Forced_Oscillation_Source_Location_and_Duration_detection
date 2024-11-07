import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Plot from "./pages/Plot";
import Detect from "./pages/Detect";
import LocateSource from "./pages/LocateSource";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/plot" element={<Plot />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/locate" element={<LocateSource />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
