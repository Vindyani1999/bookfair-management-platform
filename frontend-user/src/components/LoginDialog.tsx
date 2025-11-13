import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ForgotPasswordModal from "./ForgotPasswordModal";
import CustomButton from "./atoms/CustomButton";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginDialog({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
      navigate("/app/dashboard");
    }
  }, [isAuthenticated, navigate, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password, rememberMe });
      const from =
        (location.state as { from?: { pathname?: string } } | undefined)?.from
          ?.pathname || "/app/dashboard";
      navigate(from, { replace: true });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { background: "transparent", boxShadow: "none" } }}
        BackdropProps={{ sx: { bgcolor: "rgba(0,0,0,0.45)" } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <div className="w-full max-w-md mx-auto py-4">
            <div
              className="backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="text-center mb-6">
                <img
                  src="/images/logo.png"
                  alt="Book.me"
                  className="h-18 mx-auto mb-2"
                />
                <p className="text-white text-sm font-medium">
                  Login to make your stall reservation
                </p>
              </div>

              {error && (
                <div className="mb-4 p-2 bg-red-500/80 backdrop-blur-sm rounded-lg text-white text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-white text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-white text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 mr-2 rounded bg-white/10 border-white/20 cursor-pointer"
                      disabled={loading}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="flex items-center text-white cursor-pointer"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="flex gap-2">
                  <CustomButton
                    label="Login"
                    type="submit"
                    // variant="contained"
                    color="primary"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </CustomButton>
                </div>
              </form>

              <p className="mt-4 text-center text-white text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="font-semibold hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
}
