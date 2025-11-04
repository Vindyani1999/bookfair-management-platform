import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl shadow-2xl" : "bg-transparent"
      }`}
      style={{
        backgroundColor: scrolled ? "#DACDC9" : "transparent",
      }}
    >
      <nav className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <BookOpen className="w-8 h-8 text-white transition-transform group-hover:rotate-12 duration-300" />
            <img
              src="/images/logo.png"
              alt="Book.me"
              className="h-14 w-auto transition-transform group-hover:scale-110 duration-300"
            />
          </div>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 from-amber-950-600 to-black-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}
