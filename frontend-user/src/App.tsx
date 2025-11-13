import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import ProtectedRoute from './components/ProtectedRoute';
import About from "./pages/info/AboutPage";
import FAQ from "./pages/info/FAQPage";
import TermsOfService from "./pages/info/TermsOfServicePage";
import PrivacyPolicy from "./pages/info/PrivacyPolicyPage";
// import TemporaryStepperPage from "./pages/TemporaryStepperPage";
import DrawerLayout from "./components/Layout/DrawerLayout";
import Dashboard from "./pages/Dashboard";
import BookingsPage from "./pages/BookingsPage";
import HelpPage from "./pages/HelpPage";
import SettingsPage from "./pages/SettingsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<DrawerLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          {/* <Route path="/book" element={<TemporaryStepperPage />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} /> */}
          {/* <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
