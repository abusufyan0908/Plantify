import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import PlantImage from "../assets/plant3.jpeg";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HeroSection() {
  const [open, setOpen] = useState(null);

  const toggleDropdown = (id) => {
    setOpen(open === id ? null : id);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-white p-10 mt-5 rounded-lg flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
      {/* Left Section */}
      <div className="md:w-1/2 space-y-6" data-aos="fade-up" data-aos-delay="200">
        <h1 className="text-5xl font-bold leading-tight text-black">
          Organic Plant <br /> Care and Eco-Friendly Solutions
        </h1>
        <div className="flex items-center space-x-4">
          <img
            src={PlantImage}
            alt="Plant Growth"
            className="rounded-lg w-24 h-24 object-cover"
          />
          <div className="bg-gray-100 p-4 rounded-lg w-64 shadow-sm">
            <h2 className="text-lg font-semibold">The Plantify Guide</h2>
            <p className="text-sm text-gray-600">500+ guides / 5k+ plant species</p>
            <p className="text-xs text-gray-500 mt-2">
              From beginners to experts, refresh your knowledge with our vast library on organic gardening.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section (Accordion) */}
      <div className="md:w-1/3 space-y-3 mt-6 md:mt-0">
        {[ 
          { id: "manage", label: "Manage Garden", color: "bg-green-200", text: "Learn how to maintain your garden efficiently with organic practices." },
          { id: "care", label: "Plant Care", color: "bg-gray-200", text: "Understand the best techniques for nurturing your plants naturally." },
          { id: "sustainability", label: "Sustainability", color: "bg-blue-200", text: "Discover eco-friendly ways to grow your garden sustainably." },
          { id: "learn", label: "Learn More", color: "bg-black", icon: <ArrowRight size={16} color="white" /> },
        ].map((item) => (
          <div key={item.id} className="w-full" data-aos="fade-up" data-aos-delay="300">
            {item.id === "learn" ? (
              <NavLink to="/chatbot">
                <div className={`p-4 rounded-lg flex items-center justify-between cursor-pointer ${item.color}`}>
                  <span className="font-semibold text-white">{item.label}</span>
                  {item.icon}
                </div>
              </NavLink>
            ) : (
              <>
                <div
                  className={`p-4 rounded-lg flex items-center justify-between cursor-pointer ${item.color}`}
                  onClick={() => toggleDropdown(item.id)}
                >
                  <span className="font-semibold text-black">{item.label}</span>
                  {open === item.id ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </div>
                {open === item.id && item.text && (
                  <div className="p-4 text-gray-700 text-sm bg-gray-100 rounded-b-lg">
                    {item.text}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
