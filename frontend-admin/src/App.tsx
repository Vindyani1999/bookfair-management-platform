import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookingsPage from "./pages/BookingsPage";
import ManageStallsPage from "./pages/ManageStallsPage";
import ManageAdminsPage from "./pages/ManageAdminsPage";
import ManageMapsPage from "./pages/ManageMapsPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }

          /> */}

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/manage-stalls" element={<ManageStallsPage />} />
          <Route path="/manage-admins" element={<ManageAdminsPage />} />
          <Route path="/manage-maps" element={<ManageMapsPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
