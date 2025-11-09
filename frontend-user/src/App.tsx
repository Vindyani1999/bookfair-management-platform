import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import About from "./pages/info/AboutPage";
import FAQ from "./pages/info/FAQPage";
import TermsOfService from "./pages/info/TermsOfServicePage";
import PrivacyPolicy from "./pages/info/PrivacyPolicyPage";
// import TemporaryStepperPage from "./pages/TemporaryStepperPage";
import DrawerLayout from "./components/Layout/DrawerLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<DrawerLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        {/* <Route path="/book" element={<TemporaryStepperPage />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
