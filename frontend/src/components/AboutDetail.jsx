/* eslint-disable no-unused-vars */
import React from "react";
import about1 from "../assets/about1.jpeg";
import about2 from "../assets/about2.jpeg";
import about3 from "../assets/about3.jpeg";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos"; // Animation On Scroll
import "aos/dist/aos.css"; // Import the AOS CSS

const AboutDetail = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS for animation
  }, []);

  return (
    <>
      <section className="overflow-hidden bg-gray-50 py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center -mx-6">
            {/* Image Section */}
            <div className="w-full px-6 lg:w-6/12" data-aos="fade-right">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <img
                    src={about1}
                    alt="Plantify garden setup"
                    className="rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                  />
                  <img
                    src={about2}
                    alt="Plantify indoor plants"
                    className="rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                  />
                </div>
                <div className="flex items-center">
                  <img
                    src={about3}
                    alt="Plantify personalized care"
                    className="rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div
              className="w-full px-6 mt-12 lg:w-5/12 lg:mt-0"
              data-aos="fade-left"
            >
              <div>
                <span className="inline-block mb-4 text-lg font-semibold text-teal-600">
                  Why Choose Plantify
                </span>
                <h2 className="mb-6 text-3xl lg:text-4xl font-extrabold text-gray-800">
                  Nurturing a Greener Tomorrow, One Plant at a Time
                </h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  At <span className="font-bold text-emerald-600">Plantify</span>, we specialize in
                  transforming spaces into lush green sanctuaries. From expert advice to
                  premium-quality plants and personalized care tips, we empower you to
                  create thriving greenery effortlessly.
                </p>
                <p className="mb-8 text-gray-700 leading-relaxed">
                  Whether you are a seasoned gardener or a curious beginner, our mission
                  is to make plant care accessible, enjoyable, and fulfilling. From indoor
                  aesthetics to outdoor gardens, Plantify is your trusted companion for a
                  greener lifestyle.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center py-3 px-6 text-white font-medium bg-emerald-600 rounded-lg shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
                  data-aos="zoom-in"
                >
                  Explore More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="ml-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutDetail;
