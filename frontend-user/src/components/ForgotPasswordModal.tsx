import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { Mail, ShieldCheck, Lock, Eye, EyeOff, X } from 'lucide-react';

type Step = 'email' | 'otp' | 'password';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success && step === 'password') {
      const timer = setTimeout(() => {
        onClose();
        setStep('email');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, step, onClose]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.requestPasswordReset(email);

      if (response.data.success === false) {
        setError(response.data.message || 'Email not found. Please sign up first.');
        setLoading(false);
        return;
      }

      setSuccess(response.data.message || 'OTP sent to your email successfully!');
      setTimeout(() => {
        setSuccess('');
        setStep('otp');
      }, 1500);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Email not found. Please check your email or sign up first.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid email address.');
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOtp(email, otp);
      setSuccess(response.data.message || 'OTP verified successfully!');
      setTimeout(() => {
        setSuccess('');
        setStep('password');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword(email, otp, newPassword);
      setSuccess(response.data.message || 'Password reset successful!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.requestPasswordReset(email);
      setSuccess(response.data.message || 'New OTP sent to your email!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    setSuccess('');
    if (step === 'otp') {
      setStep('email');
      setOtp('');
    } else if (step === 'password') {
      setStep('otp');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mx-auto mb-3">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
              <p className="text-white text-xs">
                Enter your registered email address and we'll send you an OTP
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-email" className="block text-white text-sm font-medium mb-2 text-left">
                  Email Address
                </label>
                <input
                  type="email"
                  id="modal-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Enter your registered email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900/80 hover:bg-slate-900/90 backdrop-blur-sm text-white font-semibold py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking Email...' : 'Send OTP'}
              </button>
            </form>
          </>
        );

      case 'otp':
        return (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mx-auto mb-3">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
              <p className="text-white text-xs">
                Enter the 6-digit code sent to
              </p>
              <p className="text-white text-xs font-semibold mt-1">{email}</p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-otp" className="block text-white text-sm font-medium mb-2 text-left">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="modal-otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-center text-xl tracking-widest placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-slate-900/80 hover:bg-slate-900/90 backdrop-blur-sm text-white font-semibold py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-white text-xs mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-white text-sm font-semibold hover:underline transition-all disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>

            <button
              onClick={handleBack}
              className="w-full mt-3 text-white text-sm hover:underline"
            >
              ← Back to Email
            </button>
          </>
        );

      case 'password':
        return (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mx-auto mb-3">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-white text-xs">
                Create a new password for your account
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-newPassword" className="block text-white text-sm font-medium mb-2 text-left">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="modal-newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="modal-confirmPassword" className="block text-white text-sm font-medium mb-2 text-left">
                  Re-Enter Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="modal-confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all pr-10"
                    style={{ backgroundColor: 'transparent' }}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ backgroundColor: 'transparent' }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-white text-xs space-y-1">
                <p className={newPassword.length >= 6 ? 'text-green-300' : 'text-white/70'}>
                  • At least 6 characters
                </p>
                <p className={newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-300' : 'text-white/70'}>
                  • Passwords match
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900/80 hover:bg-slate-900/90 backdrop-blur-sm text-white font-semibold py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md">
        <div
          className="backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          }}
        >

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white rounded-full p-1.5 transition-all duration-300 hover:bg-red-500/80!"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center mb-6 space-x-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${step === 'email'
              ? 'bg-white text-slate-900'
              : 'bg-white/20 text-white'
              }`}>
              1
            </div>
            <div className={`w-10 h-1 rounded transition-all ${step !== 'email' ? 'bg-white' : 'bg-white/20'
              }`} />
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${step === 'otp'
              ? 'bg-white text-slate-900'
              : step === 'password'
                ? 'bg-white/40 text-white'
                : 'bg-white/20 text-white'
              }`}>
              2
            </div>
            <div className={`w-10 h-1 rounded transition-all ${step === 'password' ? 'bg-white' : 'bg-white/20'
              }`} />
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${step === 'password'
              ? 'bg-white text-slate-900'
              : 'bg-white/20 text-white'
              }`}>
              3
            </div>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-green-500/80 backdrop-blur-sm rounded-lg text-white text-sm text-center animate-fade-in">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/80 backdrop-blur-sm rounded-lg text-white text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}