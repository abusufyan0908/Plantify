import { Link } from "react-router-dom";
import fertilizersImg from "../assets/cat1.png";
import soilImg from "../assets/cat2.png";
import pestControlImg from "../assets/cat3.png";
import supportImg from "../assets/cat4.png";
import plantCareImg from "../assets/cat5.png";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function PlantCareUI() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#f3efe5] to-[#e4dfd6] min-h-screen p-4 sm:p-6 md:p-10 mt-4 rounded-2xl shadow-xl flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto w-full">
        {/* Fertilizers & Plant Nutrients */}
        <div
          className="relative col-span-1 sm:col-span-2 row-span-1 group overflow-hidden rounded-xl"
          data-aos="fade-up"
        >
          <img
            src={fertilizersImg}
            alt="Fertilizers & Plant Nutrients"
            className="w-full h-48 sm:h-56 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-center p-4 transition-opacity duration-300">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Fertilizers & Plant Nutrients</h2>
          </div>
        </div>

        {/* Soil & Growing Mediums */}
        <div
          className="relative col-span-1 row-span-1 group overflow-hidden rounded-xl"
          data-aos="zoom-in"
        >
          <img
            src={soilImg}
            alt="Soil & Growing Mediums"
            className="w-full h-48 sm:h-56 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-center p-4 transition-opacity duration-300">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Soil & Growing Mediums</h2>
          </div>
        </div>

        {/* Pest & Disease Control */}
        <div
          className="relative col-span-1 sm:col-span-1 row-span-2 group overflow-hidden rounded-xl"
          data-aos="flip-left"
        >
          <img
            src={pestControlImg}
            alt="Pest & Disease Control"
            className="w-full h-64 sm:h-80 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-center p-4 transition-opacity duration-300">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Pest & Disease Control</h2>
          </div>
        </div>

        {/* Plant Care Essentials */}
        <div className="relative col-span-1 sm:col-span-2 row-span-1 group overflow-hidden rounded-xl" data-aos="fade-up">
          <img
            src={plantCareImg}
            alt="Plant Care Essentials"
            className="w-full h-48 sm:h-56 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-center p-4 transition-opacity duration-300">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Plant Care Essentials</h2>
          </div>
        </div>

        {/* Plant Support & Protection */}
        <div
          className="relative col-span-1 row-span-1 group overflow-hidden rounded-xl"
          data-aos="zoom-in"
        >
          <img
            src={supportImg}
            alt="Plant Support & Protection"
            className="w-full h-48 sm:h-56 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-center p-4 transition-opacity duration-300">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Plant Support & Protection</h2>
          </div>
        </div>

        {/* Call to Action (Shop Now) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 row-span-1 flex flex-col justify-center items-start p-4 sm:p-6" data-aos="fade-up">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800">
            Unleash Your Space with <span className="text-[#8d6747] italic">Our Services</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            Discover a collection tailored for modern trends, where comfort meets style in the boldest way possible.
          </p>
          <Link
            to="/shope"
            className="mt-4 bg-[#8d6747] hover:bg-[#734e33] text-white font-medium px-4 sm:px-6 py-2 rounded-lg shadow-md transition-all duration-300 text-sm sm:text-base"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
