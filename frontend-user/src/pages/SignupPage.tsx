import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    businessName: '',
    businessAddress: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.contactNumber.trim()) {
      setError('Contact number is required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(formData);

      setSuccess('Registration successful! Redirecting to login...');

      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Registration successful! Please login with your credentials.',
            email: formData.email
          }
        });
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-2">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/images/bgimg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)',
          transform: 'scale(1.1)',
        }}
      />

      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center space-x-2 group">
          <BookOpen className="w-8 h-8 text-white transition-transform group-hover:rotate-12 duration-300" />
          <img
            src="/images/logo.png"
            alt="Book.me"
            className="h-14 w-auto transition-transform group-hover:scale-110 duration-300"
          />
        </Link>
      </div>

      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-slate-800/80 hover:bg-slate-900/80 backdrop-blur-sm text-white rounded-lg font-semibold transition-all duration-300"
        >
          Login
        </button>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div
          className="backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/30"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          }}
        >
          <div className="text-center mb-4">
            <img src="/images/logo.png" alt="Book.me" className="h-16 mx-auto" />
            <p className="text-white text-sm font-medium">
              Create an account to make your stall reservation
            </p>
          </div>

          {success && (
            <div className="mb-6 p-3 bg-green-500/80 backdrop-blur-sm rounded-lg text-white text-sm text-center animate-fade-in">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-500/80 backdrop-blur-sm rounded-lg text-white text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fullName" className="block text-white text-sm font-medium mb-2">
                  Full Name <span className="text-red-300">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                  disabled={loading || !!success}
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-white text-sm font-medium mb-2">
                  Contact Number <span className="text-red-300">*</span>
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Enter contact number"
                  required
                  disabled={loading || !!success}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email Address <span className="text-red-300">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
                disabled={loading || !!success}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="businessName" className="block text-white text-sm font-medium mb-2">
                  Business Name  <span className="text-white/60">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Enter business name"
                  disabled={loading || !!success}
                />
              </div>

              <div>
                <label htmlFor="businessAddress" className="block text-white text-sm font-medium mb-2">
                  Business Address <span className="text-white/60">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="businessAddress"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Enter business address"
                  disabled={loading || !!success}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                  Password <span className="text-red-300">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Create a password"
                  required
                  minLength={6}
                  disabled={loading || !!success}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
                  Confirm Password <span className="text-red-300">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  disabled={loading || !!success}
                />
              </div>
            </div>

            <div className="text-white text-xs space-y-1 bg-white/10 rounded-lg p-3">
              <p className={formData.password.length >= 6 ? 'text-green-300' : 'text-white/70'}>
                • At least 6 characters
              </p>
              <p className={formData.password === formData.confirmPassword && formData.password.length > 0 ? 'text-green-300' : 'text-white/70'}>
                • Passwords match
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full bg-slate-900/80 hover:bg-slate-900/90 backdrop-blur-sm text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : success ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Success!
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-white text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline transition-all">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}