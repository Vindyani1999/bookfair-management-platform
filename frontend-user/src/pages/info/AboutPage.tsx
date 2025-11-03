import Header from "../../components/Header";
import Footer from '../../components/Footer';

export default function About() {
  const offers = [
    {
      title: "For Publishers",
      description: [
        "Prime exhibition space with customizable stalls",
        "Direct access to thousands of potential customers",
        "Networking opportunities with industry leaders",
      ],
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "For Visitors",
      description: [
        "Discover books across all genres and languages",
        "Meet authors and participate in book signings",
        "Special discounts and exclusive book launches",
      ],
      color: "from-orange-600 to-red-600",
    },
    {
      title: "For Authors",
      description: [
        "Platform to showcase your latest works",
        "Engage directly with your readers",
        "Panel discussions and literary workshops",
      ],
      color: "from-amber-700 to-amber-900",
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-linear-to-b bg-gray-100">
      <Header />
      <div className="w-full bg-linear-to-r  from-gray-900 to-gray-800 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About Colombo International Book Fair
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Sri Lanka's premier literary event, bringing together publishers,
            authors, and book lovers since its inception.
          </p>
        </div>
      </div>

      <div className="w-full px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <section>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                The Colombo International Book Fair, organized by the Sri Lanka
                Book Publishers' Association, has become the largest and most
                anticipated book fair and exhibition in Sri Lanka. Each year,
                we witness growing popularity as book publishers, vendors, and
                literary enthusiasts gather to celebrate the written word.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to promote literacy, support local publishers,
                and create a vibrant platform where readers can discover new
                worlds through books. The fair has become a cultural landmark,
                attracting over 50,000 visitors annually.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {offers.map((offer, idx) => (
                <div
                  key={idx}
                  className={`group relative bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-amber-200/50 overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${offer.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${offer.color} opacity-10 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500`}
                  ></div>

                  <h3
                    className={`relative text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-amber-700 group-hover:to-orange-700 transition-all duration-300`}
                  >
                    {offer.title}
                  </h3>

                  <ul className="relative space-y-3 text-gray-700 leading-relaxed">
                    {offer.description.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <section>
            <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Organized By</h2>
                <p className="text-lg mb-4">
                  Sri Lanka Book Publishers' Association
                </p>
                <p className="text-gray-300">
                  The Sri Lanka Book Publishers' Association is the leading
                  organization representing book publishers in Sri Lanka,
                  dedicated to promoting literature, supporting the publishing
                  industry, and fostering a reading culture across the nation.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
