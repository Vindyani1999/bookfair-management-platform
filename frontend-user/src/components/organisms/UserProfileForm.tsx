import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI, authAPI } from "../../services/api";
import type { UserProfileData } from "../../utils/types";
import {
  Mail,
  User,
  Phone,
  Building,
  MapPin,
  CheckCircle,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Info,
  ArrowRight,
  Check,
} from "lucide-react";

export default function UserProfileForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<UserProfileData>({
    fullName: "",
    contactNumber: "",
    email: "",
    businessName: "",
    businessAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [showPasswordFlow, setShowPasswordFlow] = useState(false);
  const [passwordFlowStep, setPasswordFlowStep] = useState<
    "initial" | "otp" | "newpass"
  >("initial");
  const [passwordEmail, setPasswordEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.contactPerson || "",
        contactNumber: user.phoneNumber || "",
        email: user.email || "",
        businessName: user.businessName || "",
        businessAddress: user.businessAddress || "",
      });
      setPasswordEmail(user.email || "");
    }
  }, [user]);

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess(false);
  };

  const handleBlur = (field: keyof UserProfileData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateProfileForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.contactNumber.trim()) {
      setError("Contact number is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setSuccessMessage("");

    try {
      const updateData = {
        contactPerson: formData.fullName,
        phoneNumber: formData.contactNumber,
        email: formData.email,
        businessName: formData.businessName || undefined,
        businessAddress: formData.businessAddress || undefined,
      };

      const response = await userAPI.updateOwnProfile(updateData);

      const updatedUser = response.data.user;

      if (sessionStorage.getItem("token")) {
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }
      if (localStorage.getItem("token")) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setSuccess(true);
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        setSuccess(false);
        setSuccessMessage("");
      }, 5000);
    } catch (err: any) {
      console.error("Update error:", err);

      let errorMessage = "Failed to update profile. Please try again.";

      if (err.response?.status === 400) {
        errorMessage =
          err.response?.data?.message ||
          "Invalid input. Please check your data.";
      } else if (err.response?.status === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (err.response?.status === 404) {
        errorMessage = "User not found. Please login again.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please contact support.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!passwordEmail.trim()) {
      setPasswordError("Email is required");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");

    try {
      await authAPI.requestPasswordReset(passwordEmail);
      setPasswordFlowStep("otp");
      setPasswordError("");
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setPasswordError("Please enter a valid 6-digit OTP");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");

    try {
      const response = await authAPI.verifyOtp(passwordEmail, otp);
      setResetToken(response.data.resetToken);
      setPasswordFlowStep("newpass");
      setPasswordError("");
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setPasswordError("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");

    try {
      await authAPI.resetPassword(passwordEmail, otp, newPassword);

      setSuccess(true);
      setSuccessMessage(
        "Password changed successfully! Please login with your new password."
      );

      setTimeout(() => {
        setShowPasswordFlow(false);
        setPasswordFlowStep("initial");
        setPasswordEmail(user?.email || "");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setResetToken("");
      }, 2000);
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const resetPasswordFlow = () => {
    setShowPasswordFlow(false);
    setPasswordFlowStep("initial");
    setPasswordEmail(user?.email || "");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setResetToken("");
    setPasswordError("");
  };

  const getFieldError = (field: keyof UserProfileData): string => {
    if (!touched[field]) return "";

    if (field === "fullName" && !formData.fullName.trim()) {
      return "Full name is required";
    }
    if (field === "contactNumber" && !formData.contactNumber.trim()) {
      return "Contact number is required";
    }
    if (field === "email") {
      if (!formData.email.trim()) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return "Invalid email format";
    }
    return "";
  };

  return (
    <div className="w-full">
      {/* <div>
                <h2 className="text-3xl font-bold text-slate-900">
                    Update Your Details
                </h2>
                <p className="text-slate-600 text-sm">
                    Make sure to don't update your personal or business details frequently.
                </p>
            </div> */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold  text-left text-slate-900 border-b pb-2">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2 text-left">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  className={`w-full pl-12 pr-4 py-3 bg-white/60 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    getFieldError("fullName")
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-300 focus:ring-slate-200"
                  }`}
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
              {getFieldError("fullName") && (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError("fullName")}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2 text-left">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    handleChange("contactNumber", e.target.value)
                  }
                  onBlur={() => handleBlur("contactNumber")}
                  className={`w-full pl-12 pr-4 py-3 bg-white/60 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    getFieldError("contactNumber")
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-300 focus:ring-slate-200"
                  }`}
                  placeholder="+94 XX XXX XXXX"
                  disabled={loading}
                />
              </div>
              {getFieldError("contactNumber") && (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError("contactNumber")}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2 text-left">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full pl-12 pr-4 py-3 bg-white/60 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  getFieldError("email")
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-300 focus:ring-slate-200"
                }`}
                placeholder="john@example.com"
                disabled={loading}
              />
            </div>
            {getFieldError("email") && (
              <p className="mt-1 text-xs text-red-600">
                {getFieldError("email")}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-left text-slate-900 border-b pb-2">
            Business Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2 text-left">
                Business Name{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  placeholder="ABC Publishers"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2 text-left">
                Business Address{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={formData.businessAddress}
                  onChange={(e) =>
                    handleChange("businessAddress", e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  placeholder="123 Main St, Colombo"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold text-slate-900">Security</h3>
            {!showPasswordFlow && (
              <button
                type="button"
                onClick={() => setShowPasswordFlow(true)}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordFlow && (
            <div className="space-y-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    passwordFlowStep === "initial" ||
                    passwordFlowStep === "otp" ||
                    passwordFlowStep === "newpass"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-300 text-slate-600"
                  }`}
                >
                  {passwordFlowStep === "initial" ||
                  passwordFlowStep === "otp" ||
                  passwordFlowStep === "newpass"
                    ? "1"
                    : "✓"}
                </div>
                <div
                  className={`w-8 h-1 ${
                    passwordFlowStep === "otp" || passwordFlowStep === "newpass"
                      ? "bg-slate-900"
                      : "bg-slate-300"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    passwordFlowStep === "otp" || passwordFlowStep === "newpass"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-300 text-slate-600"
                  }`}
                >
                  {passwordFlowStep === "newpass" ? "3" : "2"}
                </div>
                <div
                  className={`w-8 h-1 ${
                    passwordFlowStep === "newpass"
                      ? "bg-slate-900"
                      : "bg-slate-300"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    passwordFlowStep === "newpass"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-300 text-slate-600"
                  }`}
                >
                  3
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{passwordError}</p>
                </div>
              )}

              {passwordFlowStep === "initial" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Change Your Password</p>
                      <p className="text-xs text-blue-700">
                        We'll send an OTP to verify your email, then you can set
                        a new password.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        value={passwordEmail}
                        onChange={(e) => setPasswordEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="your@email.com"
                        disabled={passwordLoading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetPasswordFlow}
                      className="text-white bg-red-500!"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestOTP}
                      disabled={passwordLoading || !passwordEmail.trim()}
                      className="flex-1 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {passwordLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Send OTP
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {passwordFlowStep === "otp" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Verify Your Email</p>
                      <p className="text-xs text-blue-700">
                        Enter the 6-digit OTP sent to {passwordEmail}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">
                      Enter OTP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      maxLength={6}
                      disabled={passwordLoading}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={passwordLoading || otp.length !== 6}
                      className="flex-1 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {passwordLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          Verify OTP
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetPasswordFlow}
                      className="px-4 py-3 bg-slate-300 hover:bg-slate-400 text-slate-900 rounded-xl font-semibold transition-all"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {passwordFlowStep === "newpass" && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-3">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">Email Verified ✓</p>
                      <p className="text-xs text-green-700">
                        Now you can set your new password.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="New password"
                        disabled={passwordLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Confirm password"
                        disabled={passwordLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {(newPassword || confirmPassword) && (
                    <div className="text-xs space-y-1 bg-white rounded-lg p-3 border border-slate-200">
                      <p
                        className={
                          newPassword.length >= 6
                            ? "text-green-600 font-medium flex items-center gap-1"
                            : "text-slate-500 flex items-center gap-1"
                        }
                      >
                        {newPassword.length >= 6 ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        At least 6 characters
                      </p>
                      <p
                        className={
                          newPassword === confirmPassword &&
                          newPassword.length > 0
                            ? "text-green-600 font-medium flex items-center gap-1"
                            : "text-slate-500 flex items-center gap-1"
                        }
                      >
                        {newPassword === confirmPassword &&
                        newPassword.length > 0 ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        Passwords match
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={
                        passwordLoading ||
                        !newPassword ||
                        newPassword !== confirmPassword ||
                        newPassword.length < 6
                      }
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {passwordLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Resetting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Reset Password
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetPasswordFlow}
                      className="px-4 py-3 bg-slate-300 hover:bg-slate-400 text-slate-900 rounded-xl font-semibold transition-all"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-semibold">Success!</p>
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Save Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
