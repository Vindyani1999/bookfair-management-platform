import { useState, useEffect } from "react";

// const useCountUp = (
//   end: number,
//   duration: number = 5000,
//   start: number = 0
// ) => {
//   const [count, setCount] = useState(start);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     if (!isVisible) return;

//     let startTime: number | null = null;
//     const startValue = start;
//     const endValue = end;

//     const animate = (currentTime: number) => {
//       if (!startTime) startTime = currentTime;
//       const progress = Math.min((currentTime - startTime) / duration, 1);

//       const easeOutQuart = 1 - Math.pow(1 - progress, 4);
//       const currentCount = Math.floor(
//         startValue + (endValue - startValue) * easeOutQuart
//       );

//       setCount(currentCount);

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       }
//     };

//     requestAnimationFrame(animate);
//   }, [end, duration, start, isVisible]);

//   return { count, setIsVisible };
// };

// interface StatCardProps {
//   label: string;
//   value: string;
//   idx: number;
//   isVisible: boolean;
// }

// const StatCard = ({ label, value, idx, isVisible }: StatCardProps) => {
//   const numericValue = parseInt(value.replace(/\D/g, ""));
//   const suffix = value.replace(/\d/g, "");

//   const { count, setIsVisible: setCountVisible } = useCountUp(
//     numericValue,
//     2000
//   );

// useEffect(() => {
//   if (isVisible) {
//     const timer = setTimeout(() => {
//       setCountVisible(true);
//     }, idx * 150);
//     return () => clearTimeout(timer);
//   }
// }, [isVisible, idx, setCountVisible]);

//   return (
//     <div
//       className="bg-white/60 backdrop-blur-md rounded-2xl p-6 text-center transform transition-all duration-500 hover:scale-105 hover:bg-white/80 border border-slate-300 shadow-xl"
//       // style={{ transitionDelay: `${idx * 100}ms` }}
//     >
//       <div className="text-4xl font-bold text-slate-800 mb-2">
//         {count}
//         {suffix}
//       </div>
//       <div className="text-slate-600 text-sm font-medium">{label}</div>
//     </div>
//   );
// };

export default function Hero() {
  const [textVisible, setTextVisible] = useState(false);
  // const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setTextVisible(true), 300);
    // const statsTimer = setTimeout(() => setStatsVisible(true), 1000);

    return () => {
      clearTimeout(textTimer);
      // clearTimeout(statsTimer);
    };
  }, []);

  // const stats = [
  //   { label: "Stalls Available", value: "200+" },
  //   { label: "Publishers", value: "150+" },
  //   { label: "Days", value: "7" },
  //   { label: "Expected Visitors", value: "50K+" },
  // ];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "#DACDC9",
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/images/bgimg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.8,
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center pt-16 md:pt-0">
        <div
          className={`transition-all duration-1000 transform ${
            textVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          {/* <p className={`text-2xl md:text-3xl text-amber-100 mb-12 bg-amber-600-500/20 rounded-full border border-amber-400/30 max-w-3xl mx-auto leading-relaxed font-medium transition-all duration-1000 delay-300 animate-pulse drop-shadow ${
            textVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Colombo International Book Fair 2026
          </p> */}

          <h1 className="text-6xl md:text-8xl font-bold text-amber-50 mb-8 leading-tight tracking-tight drop-shadow-lg opacity-70">
            Book Your Stall in Seconds!
            {/* <span className="block text-amber-50 mt-4 drop-shadow-md">
              
            </span> */}
          </h1>

          {/* <div
            className={`transition-all duration-1000 delay-500 ${
              textVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <button className="group relative bg-slate-800 hover:bg-slate-900 text-white px-12 py-5 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl overflow-hidden">
              <span className="relative z-10">Reserve Now</span>
            </button>
          </div> */}

          {/* <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto transition-all duration-1000 delay-700 ${
              textVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                label={stat.label}
                value={stat.value}
                idx={idx}
                isVisible={statsVisible}
              />
            ))}
          </div> */}
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-amber-50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
