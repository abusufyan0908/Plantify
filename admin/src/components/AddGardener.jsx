import { useState } from "react";
import axios from "axios";

const AddGardener = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    experience: "",
    location: "",
    contactInfo: {
      phone: "",
      email: "",
    },
    rating: "",
    image: null,
    workImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name.includes("contactInfo")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        contactInfo: {
          ...prevData.contactInfo,
          [field]: value,
        },
      }));
    } else if (name === "workImages") {
      const workFiles = Array.from(files);
      setFormData((prevData) => ({
        ...prevData,
        workImages: workFiles,
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("bio", formData.bio);
    form.append("experience", formData.experience);
    form.append("location", formData.location);
    form.append("contactInfo[phone]", formData.contactInfo.phone);
    form.append("contactInfo[email]", formData.contactInfo.email);
    form.append("rating", formData.rating || "");
    form.append("image", formData.image);
    
    formData.workImages.forEach((file, index) => {
      form.append(`workImages[${index}]`, file);
    });

    try {
      const response = await axios.post("/api/gardener/add", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccess("Gardener added successfully!");
    } catch (error) {
      setError("Failed to add gardener. Please try again.");
      console.error("Error adding gardener:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Add New Gardener</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Gardener's Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="4"
            required
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-gray-700 font-medium mb-2">Experience</label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label htmlFor="contactInfo.phone" className="block text-gray-700 font-medium mb-2">Phone</label>
          <input
            type="text"
            id="contactInfo.phone"
            name="contactInfo.phone"
            value={formData.contactInfo.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label htmlFor="contactInfo.email" className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            id="contactInfo.email"
            name="contactInfo.email"
            value={formData.contactInfo.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-gray-700 font-medium mb-2">Rating (Optional)</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            min="1"
            max="5"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">Profile Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label htmlFor="workImages" className="block text-gray-700 font-medium mb-2">Work Images</label>
          <input
            type="file"
            id="workImages"
            name="workImages"
            multiple
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          disabled={loading}
        >
          {loading ? "Adding Gardener..." : "Add Gardener"}
        </button>
      </form>
    </div>
  );
};

export default AddGardener;
