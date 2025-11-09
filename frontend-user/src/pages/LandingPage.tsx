import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "features") {
      const el = document.getElementById("features");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.state]);
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <Hero />
      <Features />
      <Footer />

      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
