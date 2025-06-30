import { useState, useEffect } from "react";
import { MapPinIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBriefcase } from "react-icons/fa";

// Default image placeholder
const DEFAULT_PROFILE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlNWU3ZWIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI2QxZDVkYiIvPjxwYXRoIGQ9Ik0yMCA4MEMyMCA2MCAzNSA1MCA1MCA1MFM4MCA2MCA4MCA4MFoiIGZpbGw9IiNkMWQ1ZGIiLz48L3N2Zz4=";

const GardenerProfiles = () => {
  const [gardeners, setGardeners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGardeners = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gardener`
        );
        if (
          response.data &&
          response.data.gardeners &&
          Array.isArray(response.data.gardeners)
        ) {
          setGardeners(response.data.gardeners);
        } else {
          setGardeners([]);
          toast.error("Invalid gardeners data format");
        }
      } catch (error) {
        setGardeners([]);
        toast.error(error.response?.data?.message || "Failed to load gardeners");
      } finally {
        setLoading(false);
      }
    };
    fetchGardeners();
  }, []);

  const getImageUrl = (url) => {
    return url || DEFAULT_PROFILE;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-black mb-8 sm:mb-12 md:mb-16 tracking-tight">
        Meet Our Expert Gardeners
      </h1>
      {gardeners.length === 0 ? (
        <div className="text-center text-gray-600">
          No gardeners available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {gardeners.map((gardener) => (
            <div
              key={gardener._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-2xl"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="flex-shrink-0 flex justify-center items-center p-6 bg-gray-50">
                  <img
                    src={getImageUrl(gardener.faceImage)}
                    alt={gardener.name}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>

                {/* Info Section */}
                <div className="flex flex-col justify-between p-6 w-full">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {gardener.name}
                    </h2>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPinIcon className="w-5 h-5 mr-2 text-emerald-600" />
                      <span>{gardener.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaBriefcase className="w-5 h-5 mr-2 text-emerald-600" />
                      <span>{gardener.experience} years experience</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="font-semibold mr-2">Rating:</span>
                      <span>{gardener.rating || "N/A"}</span>
                    </div>
                    {gardener.skills && (
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Skills:</span>{" "}
                        {gardener.skills.join(", ")}
                      </div>
                    )}
                    {gardener.bio && (
                      <p className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">About:</span>{" "}
                        {gardener.bio}
                      </p>
                    )}
                    {gardener.contact && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Contact:</span>{" "}
                        {gardener.contact}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => navigate(`/gardener/${gardener._id}`)}
                      className="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 font-semibold"
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GardenerProfiles;
