import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to Plantify! Please read these terms carefully before using our services.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using Plantify's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">2. Account Registration</h2>
            <p className="text-gray-700 mb-4">
              To use certain features of our service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">3. Product Information</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate information about our plants and products. However:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Plant growth and appearance may vary</li>
              <li>Product images are for illustration purposes</li>
              <li>Availability of products may change</li>
              <li>Prices are subject to change without notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">4. Orders and Payments</h2>
            <p className="text-gray-700 mb-4">
              When placing an order:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You agree to pay all charges for your purchases</li>
              <li>We reserve the right to refuse or cancel orders</li>
              <li>Prices are subject to change</li>
              <li>Shipping costs will be added to your order</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">5. Shipping and Delivery</h2>
            <p className="text-gray-700 mb-4">
              We aim to deliver your plants in the best condition possible. Please note:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Delivery times are estimates only</li>
              <li>Some plants may require special handling</li>
              <li>Weather conditions may affect delivery</li>
              <li>You are responsible for providing accurate delivery information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              Our return policy:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Live plants must be returned within 7 days of delivery</li>
              <li>Plants must be in their original condition</li>
              <li>Refunds will be processed within 14 business days</li>
              <li>Shipping costs are non-refundable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content on our website, including text, images, and logos, is the property of Plantify and protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Plantify is not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Any indirect or consequential losses</li>
              <li>Loss of profits or data</li>
              <li>Damages resulting from plant care</li>
              <li>Events beyond our reasonable control</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Your continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms of Service, please contact us at:
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

export default TermsOfService; 