import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, Menu, X } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'backdrop-blur-xl shadow-2xl' : 'bg-transparent'
        }`}
      style={{
        backgroundColor: scrolled ? '#DACDC9' : 'transparent'
      }}
    >
      <nav className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <BookOpen className="w-8 h-8 text-white transition-transform group-hover:rotate-12 duration-300" />
            <img
              src="/images/logo.png"
              alt="Book.me"
              className="h-14 w-auto transition-transform group-hover:scale-110 duration-300"
            />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg">
                  <User className="w-5 h-5 text-slate-800" />
                  <span className="text-slate-800 font-medium">
                    {user?.contactPerson}
                  </span>
                </div>

                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Login
                </button>


              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-800 hover:bg-white/20 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-3 bg-white/20 backdrop-blur-md rounded-lg">
                  <User className="w-5 h-5 text-slate-800" />
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">{user?.contactPerson}</p>
                    <p className="text-slate-600 text-sm">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-all duration-300"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-all duration-300"
                >
                  Login
                </button>

                <button
                  onClick={() => handleNavigation('/signup')}
                  className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}