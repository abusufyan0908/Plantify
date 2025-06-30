import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, RefreshCw, Search, Loader } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function PlantId() {
  const [plantFile, setPlantFile] = useState(null);
  const [plantData, setPlantData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);  // Loading state

  useEffect(() => {
    AOS.init();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPlantFile(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const setPicIdData = () => {
    if (!plantFile) {
      setError("Please upload an image before identifying the plant.");
      return;
    }
    setError(null);
    const imageBase64 = plantFile.split(",")[1];

    const data = {
      api_key: "4WcFI0KG8ua44nJtVq5MSA2Yhbdfus9csC6H6qTIVzIfnbxQBy",
      images: [imageBase64],
      modifiers: ["similar_images"],
      plant_language: "en",
      plant_details: [
        "common_names",
        "url",
        "name_authority",
        "wiki_description",
        "taxonomy",
        "synonyms",
      ],
    };

    setLoading(true);  // Set loading to true when the request starts

    fetch("https://api.plant.id/v2/identify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 429) {
          throw new Error("You have reached the API rate limit. Please wait and try again later.");
        }
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.json();
      })
      .then((responseData) => {
        setPlantData(responseData.suggestions[0] || null);
        setLoading(false);  // Set loading to false when data is received
      })
      .catch((err) => {
        setError(err.message || "Failed to identify the plant. Please try again.");
        setLoading(false);  // Set loading to false in case of error
      });
  };

  const resetComponent = () => {
    setPlantFile(null);
    setPlantData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col mt-4 rounded-lg items-center justify-center p-6 bg-[#f2f7e8]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-lg p-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center text-[#1a1a1a] mb-4">
          Upload a Plant Photo
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#0B6B3D] p-6 rounded-lg cursor-pointer hover:bg-[#f2f7e8] transition">
          <Upload className="w-10 h-10 text-[#0B6B3D] mb-2" />
          <span className="text-[#0B6B3D] text-sm">Drag & Drop or Click to Upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            capture="environment"
          />
        </label>

        {plantFile && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-[#0B6B3D]">Selected Image:</h3>
            <img src={plantFile} alt="Selected Plant" className="mt-2 rounded-lg shadow-lg max-w-full h-auto" />
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 mt-8"
        >
          <button
            onClick={setPicIdData}
            className="bg-[#0B6B3D] text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base"
          >
            <Search size={18} /> Identify Plant
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 mt-2"
        >
          <button
            onClick={resetComponent}
            className="bg-[#0B6B3D] text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base"
          >
            <RefreshCw size={18} /> Reset
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center mt-4"
          >
            <Loader size={48} className="text-[#0B6B3D]" />
          </motion.div>
        )}

        {plantData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 w-full max-w-3xl"
            data-aos="fade-up"
          >
            <motion.div
              className="bg-white shadow-md rounded-lg p-4 border border-[#0B6B3D]"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-bold text-[#0B6B3D]">
                {plantData.plant_details?.common_names?.join(", ") || "N/A"}
              </h3>
              <p className="text-sm text-[#0B6B3D]">Scientific Name: {plantData.plant_name || "N/A"}</p>
              <p className="text-sm text-[#0B6B3D]">Probability: {plantData.probability ? `${(plantData.probability * 100).toFixed(2)}%` : "N/A"}</p>
              {plantData.plant_details?.url && (
                <a
                  href={plantData.plant_details.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0B6B3D] hover:underline block mt-2"
                >
                  More Info
                </a>
              )}
              {plantData.similar_images?.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {plantData.similar_images.map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={image.url}
                      alt={`Plant ${imgIndex + 1}`}
                      className="w-32 h-32 rounded-md shadow-lg"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PlantId;
