import { BookOpen, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-6 h-6 text-amber-500" />
              <span className="text-xl font-bold text-white">Book.me</span>
            </div>
            <p className="text-gray-400">
              Your gateway to Colombo International Book Fair
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-amber-500 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-amber-500 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#help" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
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

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Colombo International Book Fair. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}