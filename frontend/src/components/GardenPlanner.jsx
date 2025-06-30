import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaEnvelope, FaShareAlt, FaPlus } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import myImage from "../assets/gardenr.jpeg"; // Update with the correct path

const Page = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
      <nav className="flex justify-between items-center mb-6 sm:mb-8">
        <Link to="/add" className="rounded-full bg-[#e5ede5] p-2 hover:bg-[#d5e5d5] transition-colors duration-200" data-aos="fade-right">
          <FaPlus className="h-4 w-4 sm:h-5 sm:w-5" />
        </Link>
        <div className="flex gap-2 sm:gap-3" data-aos="fade-left">
          <Link to="/mail" className="rounded-full bg-[#e3ff99] p-2 hover:bg-[#d4ff66] transition-colors duration-200">
            <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
          <Link to="/share" className="rounded-full bg-[#1a1a1a] text-white p-2 hover:bg-[#333] transition-colors duration-200">
            <FaShareAlt className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12" data-aos="zoom-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Hire Our Gardener Community
            <br className="hidden sm:block" />
            for your Space
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Our gardener community consists of skilled professionals dedicated to nurturing vibrant and healthy landscapes. Whether you need expert care for your garden or personalized landscaping solutions, our team is here to help your green space thrive. 🌿✨
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              to="/planner" 
              className="bg-[#e3ff99] text-black hover:bg-[#d4ff66] px-4 py-2 rounded-md text-sm sm:text-base transition-colors duration-200" 
              data-aos="fade-up"
            >
              Hire Now
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-16">
          <div className="bg-[#e5ede5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative" data-aos="fade-right">
            <div className="mb-8 sm:mb-12">
              <FaArrowRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <p className="text-base sm:text-lg md:text-xl font-medium">
              At Plantify Hub, our mission is to provide expert gardening services that help transform your outdoor spaces into beautiful, vibrant, and sustainable environments. We are committed to delivering top-notch care for your gardens.
            </p>
          </div>

          <div className="bg-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8" data-aos="zoom-in">
            <div className="mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold">Our Policy</span>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              At Plantify Hub, we are committed to providing our customers with the highest level of service. Our policies are designed to ensure that we can deliver the best possible experience for our customers. We are dedicated to being fair, transparent, and respectful in all of our interactions. If you have any concerns or questions about our policies, please don't hesitate to contact us.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6" data-aos="fade-left">
            <div className="bg-white border rounded-2xl sm:rounded-3xl overflow-hidden">
              <img 
                src={myImage} 
                alt="Team collaboration" 
                className="w-full h-40 sm:h-48 object-cover"
                loading="lazy" 
              />
            </div>

            <div className="bg-[#e5ede5] rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold">95%</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">of our clients are satisfied with our services</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
