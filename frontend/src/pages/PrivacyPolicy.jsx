import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Your privacy is important to us at Plantify. This policy outlines how we collect, use, and protect your information.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information that you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Create an account on our platform</li>
              <li>Make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact our customer support</li>
              <li>Participate in surveys or promotions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Process your orders and payments</li>
              <li>Send you updates about your orders</li>
              <li>Provide customer support</li>
              <li>Send you plant care tips and gardening advice</li>
              <li>Improve our products and services</li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Service providers who assist in our operations</li>
              <li>Payment processors to handle transactions</li>
              <li>Shipping partners to deliver your orders</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to improve your browsing experience and analyze website traffic. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-700">
              Email: plantifyh@gmail.com<br />
              Address: Block E2 Block E 2 Gulberg III, Lahore
            </p>
          </section>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 