import { Shield, Lock, Eye } from 'lucide-react';
import Header from "../../components/Header";
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, display: 'block' }} className="bg-linear-to-b bg-gray-100">
      <Header />

      <div className="bg-linear-to-r from-gray-900 to-gray-800 py-20 px-6">
        <div className="container mx-auto text-center">
          <Shield className="w-16 h-16 text-amber-600 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="group relative bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-8 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-amber-200/50 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-amber-600 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-amber-600 to-orange-600 flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-500 shadow-lg z-10">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-amber-700 group-hover:to-orange-700 transition-all duration-300">
                Secure Data
              </h3>
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-amber-600 to-orange-600 opacity-10 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
            </div>

            <div className="group relative bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-8 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-amber-200/50 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-red-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-500 shadow-lg z-10">
                <Eye className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-orange-700 group-hover:to-red-700 transition-all duration-300">
                Transparency
              </h3>

              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-orange-500 to-red-500 opacity-10 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 md:p-12">

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                The Sri Lanka Book Publishers' Association operates the Colombo International Book Fair stall reservation system. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you
                use our services.
              </p>
              <p className="text-gray-700">
                By using our platform, you consent to the data practices described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-3">When you register, we collect:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Full name and business name</li>
                <li>Email address and phone number</li>
                <li>Business registration details</li>
                <li>Billing and payment information</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Reservation Information</h3>
              <p className="text-gray-700 mb-3">When you make a reservation:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Stall selection and preferences</li>
                <li>Payment transaction details</li>
                <li>QR code generation data</li>
                <li>Reservation confirmation records</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use collected information to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Process and manage your stall reservations</li>
                <li>Send confirmation emails and QR codes</li>
                <li>Process payments securely</li>
                <li>Improve our services and user experience</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
                <li>Provide customer support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your data with:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose information when required by law or to protect our rights, property,
                or safety of our users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Objection:</strong> Object to certain data processing activities</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, contact us at info@bookfair.lk
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience. Cookies help us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Remember your preferences and login status</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Personalize content and advertisements</li>
                <li>Improve site functionality</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings. Disabling cookies may affect
                site functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Fulfill the purposes outlined in this policy</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain business records</li>
              </ul>
              <p className="text-gray-700">
                After the retention period, we securely delete or anonymize your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact:
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
      </div>
      <Footer />
    </div>
  );
}