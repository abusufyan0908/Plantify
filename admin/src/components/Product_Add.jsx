import React, { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Product_Add = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [weight, setWeight] = useState("");
  const [customWeight, setCustomWeight] = useState(""); // New state for custom weight

  // Categories and Subcategories
  const categories = [
    "Organic Fertilizers",
    "Chemical Fertilizers",
    "Soil Amendments",
    "Soil and Plant Care Tools",
  ];

  const subCategories = {
    "Organic Fertilizers": ["Manure", "Compost", "Seaweed"],
    "Chemical Fertilizers": ["Nitrogen", "Phosphorus", "Potassium"],
    "Soil Amendments": ["Clay", "Sand", "Perlite"],
    "Soil and Plant Care Tools": ["Shovels", "Rakes", "Watering Cans"],
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);

    // Assign images to state
    setImage1(files[0] || null);
    setImage2(files[1] || null);
    setImage3(files[2] || null);
    setImage4(files[3] || null);
  };

  // Submit handler to send form data
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Invalid or expired token. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("subCategory", subCategory);
      formData.append("quantity", quantity); // Include quantity in form data
      formData.append("weight", customWeight || weight); // Include weight in form data
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      // Log form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post(`${backendUrl}/api/products/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false); // End loading state
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset fields after successful product add
        setName("");
        setDescription("");
        setCategory("");
        setSubCategory("");
        setPrice("");
        setQuantity(1);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setPreviewImages([]);
        setWeight("");
        setCustomWeight(""); // Reset custom weight
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false); // End loading state
      if (error.response?.status === 401) {
        alert("Invalid or expired token. Please login again.");
      } else {
        console.error("Error uploading product:", error);
        alert("Failed to add product. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>
          <p className="text-gray-600 mt-2">Fill in the details to add a new product to the system</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Product Images Preview */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Product Images</label>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {previewImages.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              ))}
              {previewImages.length < 4 && (
                <label className="h-32 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
                  <div className="text-center">
                    <IoIosAddCircle className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm text-gray-600">Add Images</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    max="4"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-gray-700 font-semibold">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-semibold">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter price"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-semibold">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter quantity"
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-semibold">Subcategory</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                disabled={!category}
              >
                <option value="">Select subcategory</option>
                {category && subCategories[category]?.map((subCat, index) => (
                  <option key={index} value={subCat}>{subCat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-gray-700 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows="4"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <label className="text-gray-700 font-semibold">Weight</label>
            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select weight</option>
              <option value="100mg">100mg</option>
              <option value="250mg">250mg</option>
              <option value="500mg">500mg</option>
              <option value="1000mg">1000mg</option>
            </select>
            <input
              type="text"
              value={customWeight}
              onChange={(e) => setCustomWeight(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Or enter custom weight"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-6 bg-teal-500 text-white rounded-lg font-semibold ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600'
              } transition-colors`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </span>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Product_Add;