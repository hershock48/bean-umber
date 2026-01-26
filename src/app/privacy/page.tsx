import { Logo } from '@/components/Logo';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Be A Number, International - how we collect, use, and protect your information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-8 w-8 text-gray-900" />
              <span className="text-xl font-semibold text-gray-900">Be A Number</span>
            </Link>
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Be A Number, International ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a donation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you make a donation or contact us, we may collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>Name and contact information (email address, phone number, mailing address)</li>
              <li>Payment information (processed securely through Stripe; we do not store credit card numbers)</li>
              <li>Donation history and preferences</li>
              <li>Communications you send to us</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website</li>
              <li>IP address (anonymized where possible)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>Process your donations and send tax receipts</li>
              <li>Send you updates about our programs and impact (you can opt out at any time)</li>
              <li>Respond to your inquiries and provide support</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li><strong>Payment processors:</strong> Stripe processes all donations securely</li>
              <li><strong>Service providers:</strong> Companies that help us operate our website and send communications</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We implement appropriate technical and organizational measures to protect your personal information. All donation transactions are processed through Stripe's secure, PCI-compliant platform. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our website uses essential cookies to ensure proper functionality. We may also use analytics cookies to understand how visitors use our site. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 mb-2"><strong>Be A Number, International</strong></p>
              <p className="text-gray-700 mb-2">8475 18 1/2 Mile Road</p>
              <p className="text-gray-700 mb-2">Marshall, MI 49068</p>
              <p className="text-gray-700">Email: Kevin@beanumber.org</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Be A Number, International. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
