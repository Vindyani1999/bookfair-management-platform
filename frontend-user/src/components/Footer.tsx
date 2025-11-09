import { BookOpen, Mail, Phone } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "features") {
      const el = document.getElementById("features");
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.state]);

  const scrollToFeatures = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "features" } });
    } else {
      const el = document.getElementById("features");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-6 h-6 text-amber-500" />
              <span className="text-xl font-bold text-white">Book.me</span>
            </div>
            <p className="text-gray-400">
              Your gateway to Colombo International Book Fair
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <button
                  onClick={scrollToFeatures}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400 hover:text-amber-500 transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@bookfair.lk</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 hover:text-amber-500 transition-colors">
                <Phone className="w-4 h-4" />
                <span>+94 11 234 5678</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 Colombo International Book Fair. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
