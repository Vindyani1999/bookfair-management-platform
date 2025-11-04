import { useState } from 'react';
import { ChevronDown,Mail, HelpCircle,Phone } from 'lucide-react';
import Header from "../../components/Header";
import Footer from '../../components/Footer';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
   <div className="bg-white rounded-xl shadow-md border border-amber-200 overflow-hidden mb-4">
    <button
      onClick={onClick}
      style={{ backgroundColor: 'white' }}
      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-amber-50 transition-colors"
    >
      <span className="font-semibold text-gray-900 pr-4">{question}</span>
      <ChevronDown
        className={`w-5 h-5 text-amber-600 shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}
      />
    </button>
    {isOpen && (
      <div className="px-6 pb-5 text-gray-700 border-t border-amber-100 pt-4 animate-[slideDown_0.3s_ease-out]">
        {answer}
      </div>
    )}
  </div>
);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I register for stall reservation?",
      answer: "Click on the 'Reserve Now' button on our homepage and follow the registration process. You'll need to provide your business information, contact details, and verify your email address."
    },
    {
      question: "What are the different stall sizes available?",
      answer: "We offer three stall sizes: Small (10ft x 10ft), Medium (15ft x 15ft), and Large (20ft x 20ft). Each size is designed to accommodate different business needs and inventory volumes."
    },
    {
      question: "How many stalls can I reserve?",
      answer: "Each business is allowed to reserve a maximum of 3 stalls per exhibition. This ensures fair distribution of space among all participants."
    },
    {
      question: "What happens after I confirm my reservation?",
      answer: "Once you confirm your reservation, you'll receive an email confirmation with your booking details and a unique QR code. This QR code serves as your entry pass to the exhibition premises."
    },
    {
      question: "Can I cancel or modify my reservation?",
      answer: "Yes, you can modify or cancel your reservation up to 30 days before the event. Please contact our support team through the Help Center for assistance with changes."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, debit cards, and bank transfers. Payment must be completed within 48 hours of reservation to secure your stall."
    },
    {
      question: "When will I receive my QR code entry pass?",
      answer: "Your QR code will be generated immediately after payment confirmation and sent to your registered email address. You can also download it from your dashboard."
    },
    {
      question: "What literary genres can I display at my stall?",
      answer: "You can display any literary genre including fiction, non-fiction, educational, children's books, religious texts, poetry, comics, and more. You'll be asked to specify your genres during registration."
    },
    {
      question: "Is there an employee portal for organizers?",
      answer: "Yes, we have a dedicated employee portal for exhibition organizers to check stall availability, manage reservations, and monitor the overall event logistics."
    },
    {
      question: "What facilities are provided with the stall?",
      answer: "Each stall comes with basic electrical connections, lighting, display shelving, and wi-fi access. Additional facilities can be requested at an extra cost."
    },
    {
      question: "What are the exhibition dates and timings?",
      answer: "The Colombo International Book Fair runs for 7 consecutive days. Daily timings are 9:00 AM to 8:00 PM. Specific dates are announced on our homepage and through email notifications."
    }
  ];

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, display: 'block' }} className="bg-linear-to-b bg-gray-100">
      <Header />
      <div style={{ width: '100%' }} className="bg-linear-to-r from-gray-900 to-gray-800 py-20 px-6">
        <div className="container mx-auto text-center max-w-7xl">
          <HelpCircle className="w-16 h-16 text-amber-600 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            common Asked Questions
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Find answers to common questions about stall reservations and the book fair
          </p>
        </div>
      </div>

      <div className="w-full px-6 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-gray-600 text-center">
              Can't find what you're looking for? Contact our support team {' '}
              <a href="mailto:info@bookfair.lk" className="text-amber-600 hover:underline">
                +94 11 234 5678
              </a>
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          <div className="mt-12 bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="mb-6 text-gray-300">
              Our support team is here to help you with any inquiries
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-gray-300 text-sm mb-3">
                Get help via email within 24 hours
              </p>
              <a
                href="mailto:info@bookfair.lk"
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                info@bookfair.lk
              </a>
            </div>

            <div className="text-center">
              <div className="bg-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-300 text-sm mb-3">
                Mon-Fri, 9AM-6PM (IST)
              </p>
              <a
                href="tel:+94112345678"
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                +94 11 234 5678
              </a>
            </div>

          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}