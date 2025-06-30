/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import member1 from '../assets/sufi.jpg'; // Replace with your image paths
import member2 from '../assets/shafat.jpeg';
import member3 from '../assets/muaz.jpeg';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Team = () => {
  const [showPopup, setShowPopup] = useState(null); // State to control popup visibility

  // Social media links for each team member
  const socialLinks = {
    AbuSufyan: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com'
    },
    ShafatZulfiqar: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com'
    },
    MuazKhalil: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com'
    }
  };

  const handleConnectClick = (name) => {
    setShowPopup(name); // Show the popup for the specific team member
  };

  const closePopup = () => {
    setShowPopup(null); // Close the popup
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            The passionate individuals behind Plantify
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="relative h-80 overflow-hidden">
              <img
                src={member1}
                alt="Abu"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Abu Sufyan</h3>
              <p className="text-gray-600 mb-4">
                Passionate about technology, design, and crafting solutions. Working to make an impact through innovation.
              </p>
              <button
                onClick={() => handleConnectClick('AbuSufyan')}
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                Connect with Abu
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="relative h-80 overflow-hidden">
              <img
                src={member2}
                alt="Shafat"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Shafat Zulfiqar</h3>
              <p className="text-gray-600 mb-4">
                A strategic thinker with a passion for innovation and creating impactful designs that push boundaries.
              </p>
              <button
                onClick={() => handleConnectClick('ShafatZulfiqar')}
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                Connect with Shafat
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="relative h-80 overflow-hidden">
              <img
                src={member3}
                alt="Muaz"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Muaz Khalil</h3>
              <p className="text-gray-600 mb-4">
                A creative problem-solver with a knack for bringing unique ideas to life. Focused on user-centered designs.
              </p>
              <button
                onClick={() => handleConnectClick('MuazKhalil')}
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                Connect with Muaz
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Popup for social media links */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Connect with {showPopup === 'AbuSufyan' ? 'Abu Sufyan' : showPopup === 'ShafatZulfiqar' ? 'Shafat Zulfiqar' : 'Muaz Khalil'}
              </h3>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center gap-6">
              <a
                href={socialLinks[showPopup].facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-600 transition-colors duration-200"
              >
                <FaFacebook className="w-8 h-8" />
              </a>
              <a
                href={socialLinks[showPopup].twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-600 transition-colors duration-200"
              >
                <FaTwitter className="w-8 h-8" />
              </a>
              <a
                href={socialLinks[showPopup].linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-600 transition-colors duration-200"
              >
                <FaLinkedin className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
