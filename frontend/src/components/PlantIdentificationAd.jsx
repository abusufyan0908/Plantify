import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import mountainImg from "../assets/about2.jpeg";
import roadImg from "../assets/camera.png";

const SmileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block text-[#0B6B3D]"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);

export default function TravelVibe() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: "ease-in-out" });
  }, []);

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen mt-4 bg-[#f2f7e8] p-8 flex rounded-lg items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left Section */}
        <div
          data-aos="fade-right"
          className="col-span-1 md:col-span-5 bg-[#0B6B3D] rounded-3xl p-8 relative overflow-hidden"
        >
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            {"What's the Plant? Find Out!".split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.div variants={buttonVariants} whileHover="hover" className="flex items-center gap-2 mt-8">
            <Link to="/plantid">
              <motion.button className="bg-[#064c2b] text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base">
                TRY NOW
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  →
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="col-span-1 md:col-span-7 flex flex-col gap-4">
          <h2 data-aos="fade-left" className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
            Your Plant Finder buddy.
            <SmileIcon />
          </h2>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className="bg-[#0B6B3D] rounded-full px-6 py-3 flex justify-end"
          >
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-white">
              →
            </motion.span>
          </motion.div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[mountainImg, roadImg].map((img, index) => (
              <div key={index} data-aos="zoom-in" className="rounded-3xl overflow-hidden h-48 sm:h-64">
                <img
                  src={img || "/placeholder.svg"}
                  alt="Plant scene"
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
