import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

// import Dashboard from "./pages/Dashboard";
import BookingsPage from "./pages/BookingsPage";
import ManageStallsPage from "./pages/ManageStallsPage";
import ManageAdminsPage from "./pages/ManageAdminsPage";
import ManageMapsPage from "./pages/ManageMapsPage";
import DrawerLayout from "./components/layouts/DrawerLayout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<DrawerLayout />}>
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="manage-stalls" element={<ManageStallsPage />} />
            <Route path="manage-admins" element={<ManageAdminsPage />} />
            <Route path="manage-maps" element={<ManageMapsPage />} />
            {/* <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }

          /> */}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
