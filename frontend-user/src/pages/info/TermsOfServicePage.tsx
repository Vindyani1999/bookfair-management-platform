import { FileText, AlertCircle } from 'lucide-react';
import Header from "../../components/Header";
import Footer from '../../components/Footer';

export default function TermsOfService() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, display: 'block' }} className="bg-linear-to-b bg-gray-100">
      <Header />
      <div className="bg-linear-to-r from-gray-900 to-gray-800 py-20 px-6">
        <div className="container mx-auto text-center">
          <FileText className="w-16 h-16 text-amber-600 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Last updated: November 2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-amber-200 p-8 md:p-12">

          <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-lg mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-amber-600 mr-3 shrink-0 mt-1" />
              <p className="text-gray-700">
                Please read these terms carefully before using our stall reservation system.
                By registering and using our services, you agree to be bound by these terms.
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using the Colombo International Book Fair stall reservation system,
              you accept and agree to be bound by these Terms of Service. If you do not agree to
              these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 mb-4">
              Our services are available only to book publishers, vendors, and businesses legally
              authorized to conduct business in Sri Lanka.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Registration and Account</h2>
            <p className="text-gray-700 mb-4">
              To reserve a stall, you must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Stall Reservations</h2>
            <p className="text-gray-700 mb-4">
              <strong>Reservation Limits:</strong> Each business may reserve a maximum of 3 stalls per exhibition.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Stall Sizes:</strong> Available in Small, Medium, and Large configurations as displayed on the venue map.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Availability:</strong> Stalls are allocated on a first-come, first-served basis.
              Reserved stalls will be marked as unavailable on the map.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>

            <p className="text-gray-700 mb-4">
              All payments are processed securely through our authorized payment gateway. Payment
              confirmation will be sent via email along with your QR code entry pass.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. QR Code Entry Pass</h2>
            <p className="text-gray-700 mb-4">
              A unique QR code will be generated for each reservation and serves as your official
              entry pass to the exhibition premises. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Safeguarding your QR code</li>
              <li>Presenting it at the venue entrance</li>
              <li>Notifying us immediately if lost or compromised</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Exhibitor Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              As an exhibitor, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Display only legal and authorized content</li>
              <li>Comply with all venue rules and regulations</li>
              <li>Maintain your stall in a professional manner</li>
              <li>Respect neighboring exhibitors and attendees</li>
              <li>Not sell prohibited or illegal materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content, trademarks, and materials on this platform are owned by the
              Sri Lanka Book Publishers' Association or licensed to us. You may not use,
              reproduce, or distribute any content without express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              We are not liable for any indirect, incidental, special, or consequential damages
              arising from your use of our services, including but not limited to loss of profits,
              data, or business opportunities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modifications to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Changes will be posted on
              this page with an updated revision date. Continued use of our services after changes
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms are governed by the laws of Sri Lanka. Any disputes shall be subject to
              the exclusive jurisdiction of the courts in Colombo, Sri Lanka.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-4 text-white">
              <p className="text-white">
                <strong>Sri Lanka Book Publishers' Association</strong><br />
                Email: info@bookfair.lk<br />
                Phone: +94 11 234 5678
              </p>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}