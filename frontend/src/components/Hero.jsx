import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Import images
import Plant1 from "../assets/plant1.jpeg";
import Plant2 from "../assets/plant2.jpeg";
import Plant3 from "../assets/plant3.jpeg";
import Plant4 from "../assets/plant4.jpeg";

const Hero = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const plantImages = [Plant1, Plant2, Plant3, Plant4];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % plantImages.length);
    }, 4000);

    return () => clearInterval(imageInterval);
  }, [plantImages.length]);

  return (
    <div className="relative min-h-[80vh] sm:min-h-screen bg-[#0C1618] overflow-hidden rounded-lg mt-4 p-4 sm:p-8">
      {/* Main Content */}
      <div className="relative container mx-auto px-4 lg:px-12">
        <div className="flex flex-col lg:flex-row min-h-[80vh] sm:min-h-screen items-center">
          {/* Left Section */}
          <div className="flex-1 pt-8 sm:pt-16 lg:pt-0 z-10 text-center lg:text-left" data-aos="fade-right">
            <div className="relative">
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-900/30 text-emerald-400 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase border border-emerald-500/20 backdrop-blur-sm">
                <Sprout className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Sustainable Plantify Living
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mt-4 sm:mt-6 text-white leading-tight">
                <span className="block bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  Grow.
                </span>
                <span className="block bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                  Nurture.
                </span>
                <span className="block bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                  Thrive.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/80 my-4 sm:my-6 max-w-lg mx-auto lg:mx-0">
                Bring nature indoors with PLANTIFY HUB. Use our services and modify your life. Create a peaceful,
                vibrant space that breathes life into your home.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                <a
                  href="/login"
                  className="relative px-5 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-xl shadow-md transition-transform transform hover:scale-105 text-sm sm:text-base"
                  data-aos="zoom-in"
                >
                  Start Now
                </a>
                <a
                  href="/about"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 border border-emerald-600 text-emerald-400 rounded-xl hover:bg-emerald-900/30 transition-all text-sm sm:text-base"
                  data-aos="zoom-in"
                >
                  About Us
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Improved Image Grid Layout */}
          <div className="flex-1 relative mt-8 sm:mt-12 lg:mt-0" data-aos="fade-left">
            <div className="grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4 w-full max-w-2xl mx-auto aspect-square">
              <div className="col-span-4 row-span-4 relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                <img
                  src={plantImages[imageIndex] || "/placeholder.svg"}
                  alt={`Plant ${imageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              </div>
              <div className="col-span-2 row-span-3 relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                <img
                  src={plantImages[(imageIndex + 1) % 4] || "/placeholder.svg"}
                  alt={`Plant ${((imageIndex + 1) % 4) + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-2 row-span-3 relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                <img
                  src={plantImages[(imageIndex + 2) % 4] || "/placeholder.svg"}
                  alt={`Plant ${((imageIndex + 2) % 4) + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-4 row-span-2 relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                <img
                  src={plantImages[(imageIndex + 3) % 4] || "/placeholder.svg"}
                  alt={`Plant ${((imageIndex + 3) % 4) + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;