import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white border-t mt-4 rounded-lg border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Plantify<span className="text-emerald-600">Hub</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              A FYP Project By Superior University City Campus
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaInstagram, FaTwitter].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-gray-400 hover:text-emerald-600 transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "About", "Contact", "Shop Now!"].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item === "Shop Now!" ? "/shope" : `/${item.toLowerCase()}`} 
                    className="text-gray-500 hover:text-emerald-600 text-sm transition-colors duration-300 flex items-center group"
                  >
                    <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="text-gray-500 text-sm">
                <span className="font-medium text-gray-900">Email:</span> plantifyh@gmail.com
              </li>
              <li className="text-gray-500 text-sm">
                <span className="font-medium text-gray-900">Phone:</span> +92 3288982923
              </li>
              <li className="text-gray-500 text-sm">
                <span className="font-medium text-gray-900">Address:</span> Block E2 Block E 2 Gulberg III, Lahore
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Newsletter
            </h4>
            <div className="relative">
              {!subscribed ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300 text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-emerald-600">Thanks for subscribing! 🌿</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs sm:text-sm text-gray-500 text-center md:text-left">
              &copy; {currentYear} PlantifyHub. All rights reserved by Superior University City Campus.
            </p>
            <div className="flex justify-center space-x-4 sm:space-x-6">
              <Link to="/privacy" className="text-xs sm:text-sm text-gray-400 hover:text-emerald-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs sm:text-sm text-gray-400 hover:text-emerald-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
