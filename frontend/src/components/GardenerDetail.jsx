import { useState, useEffect } from "react";
import { MapPinIcon, EnvelopeIcon, PhoneIcon, StarIcon } from "@heroicons/react/20/solid";
import { FaComments } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DEFAULT_PROFILE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlNWU3ZWIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI2QxZDVkYiIvPjxwYXRoIGQ9Ik0yMCA4MEMyMCA2MCAzNSA1MCA1MCA1MFM4MCA2MCA4MCA4MFoiIGZpbGw9IiNkMWQ1ZGIiLz48L3N2Zz4=";

const GardenerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gardener, setGardener] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGardener = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/gardener/${id}`);
        if (response.data.success && response.data.gardener) {
          setGardener(response.data.gardener);
        } else {
          setError("Gardener not found");
        }
      } catch {
        setError("Gardener not found");
      } finally {
        setLoading(false);
      }
    };
    fetchGardener();
  }, [id]);

  const renderStars = (rating) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, idx) => (
          <StarIcon key={idx} className="w-5 h-5 text-yellow-400" />
        ))}
        {halfStar && <StarIcon className="w-5 h-5 text-yellow-400" style={{ clipPath: "inset(0 50% 0 0)" }} />}
        {[...Array(emptyStars)].map((_, idx) => (
          <StarIcon key={idx} className="w-5 h-5 text-gray-300" />
        ))}
      </div>
    );
  };

  const handleHireClick = () => {
    navigate(`/chat/${gardener._id}?type=hire`);
  };

  const handleChatClick = () => {
    navigate(`/chat/${gardener._id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !gardener) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Gardener not found</h1>
        <button
          onClick={() => navigate('/planner')}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Back to Gardeners
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={gardener.faceImage || DEFAULT_PROFILE}
            alt={gardener.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex-1 space-y-1">
            <h2 className="text-3xl font-bold text-gray-900">{gardener.name}</h2>
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="w-5 h-5 mr-1 text-emerald-600" />
              <span>{gardener.location}</span>
            </div>
            <div className="text-gray-600">{gardener.experience} of experience</div>
            <div className="flex items-center">
              {renderStars(gardener.rating)}
              <span className="ml-2 text-gray-700">Rating: {gardener.rating || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h3 className="text-xl font-semibold mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">{gardener.bio}</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center">
              <EnvelopeIcon className="w-5 h-5 mr-2 text-emerald-600" />
              <a href={`mailto:${gardener.email}`} className="hover:underline">{gardener.email}</a>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="w-5 h-5 mr-2 text-emerald-600" />
              <a href={`tel:${gardener.phone}`} className="hover:underline">{gardener.phone}</a>
            </div>
          </div>
        </div>

        {/* Work History */}
        {gardener.workHistory?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Work History</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {gardener.workHistory.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Portfolio */}
        {gardener.workImages?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Portfolio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {gardener.workImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Portfolio ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={handleHireClick}
            disabled={!gardener.isAvailable}
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              gardener.isAvailable
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {gardener.isAvailable ? 'Hire Me' : 'Currently Hired'}
          </button>
          <button
            onClick={handleChatClick}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            <FaComments className="w-4 h-4 mr-2" />
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GardenerDetail;
