import { MapPin, CheckCircle, Calendar } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: MapPin,
      title: "Interactive Stall Map",
      description:
        "Explore available stalls through our real-time interactive map. Choose from small, medium, or large stalls and reserve up to 3 stalls per business with instant visual feedback.",
      color: "from-amber-600 to-orange-600",
    },
    {
      icon: CheckCircle,
      title: "Instant Confirmation",
      description:
        "Receive immediate email confirmation with your unique QR code pass. Simply download and present at the exhibition entrance for hassle-free access.",
      color: "from-orange-600 to-red-600",
    },
    {
      icon: Calendar,
      title: "Easy Management",
      description:
        "Manage all your reservations from one dashboard. Add literary genres, track bookings, and update your exhibition details effortlessly throughout the event.",
      color: "from-amber-700 to-amber-900",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-">
      <div className="container mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 text-center mb-6">
          Why Choose Our Platform?
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Experience seamless stall booking with cutting-edge features designed
          for publishers
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-amber-200/50 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              <div
                className={`relative w-16 h-16 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-500 shadow-lg`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="relative text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-amber-700 group-hover:to-orange-700 transition-all duration-300">
                {feature.title}
              </h3>
              <p className="relative text-gray-700 leading-relaxed">
                {feature.description}
              </p>

              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${feature.color} opacity-10 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
