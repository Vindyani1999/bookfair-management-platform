import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TemporaryStepperPage from "./pages/TemporaryStepperPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book" element={<TemporaryStepperPage />} />
      </Routes>
    </Router>
  );
}

export default App;
