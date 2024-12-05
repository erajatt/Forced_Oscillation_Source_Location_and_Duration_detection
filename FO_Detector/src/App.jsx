import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Plot from "./pages/Plot";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plot" element={<Plot />} />
        </Routes>
        <Footer class="mt-2" />
      </Router>
    </div>
  );
}

export default App;
