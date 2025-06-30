import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Gard_Add = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    phone: '',
    bio: '',
    experience: '',
    workHistory: [''],
    faceImage: null,
    workImages: []
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewWorkImages, setPreviewWorkImages] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle work history changes
  const handleWorkHistoryChange = (index, value) => {
    const newWorkHistory = [...formData.workHistory];
    newWorkHistory[index] = value;
    setFormData(prev => ({
      ...prev,
      workHistory: newWorkHistory
    }));
  };

  // Add new work history field
  const addWorkHistoryField = () => {
    setFormData(prev => ({
      ...prev,
      workHistory: [...prev.workHistory, '']
    }));
  };

  // Remove work history field
  const removeWorkHistoryField = (index) => {
    const newWorkHistory = formData.workHistory.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      workHistory: newWorkHistory
    }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'faceImage') {
      setFormData(prev => ({
        ...prev,
        faceImage: files[0]
      }));
      // Create preview URL
      if (files[0]) {
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    } else if (name === 'workImages') {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        workImages: fileArray
      }));
      // Create preview URLs
      const previewURLs = fileArray.map(file => URL.createObjectURL(file));
      setPreviewWorkImages(previewURLs);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key === 'workHistory') {
          formDataToSend.append(key, JSON.stringify(formData[key].filter(item => item !== '')));
        } else if (key !== 'faceImage' && key !== 'workImages') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append files
      if (formData.faceImage) {
        formDataToSend.append('faceImage', formData.faceImage);
      }
      
      formData.workImages.forEach(image => {
        formDataToSend.append('workImages', image);
      });

      const response = await axios.post(
        `${backendUrl}/api/gardeners/create`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Gardener added successfully!');
        navigate('/gardeners');
      }
    } catch (error) {
      console.error('Error adding gardener:', error);
      toast.error(error.response?.data?.message || 'Error adding gardener');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Add New Gardener</h2>
          <p className="text-gray-600 mt-2">Fill in the details to add a new gardener to the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Preview Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <label
                htmlFor="faceImage"
                className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  type="file"
                  id="faceImage"
                  name="faceImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-gray-700 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="Enter gardener's name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 font-semibold">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="Enter location"
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 font-semibold">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Bio and Experience */}
          <div className="space-y-2">
            <label className="text-gray-700 font-semibold">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              required
              placeholder="Enter gardener's bio"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-semibold">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="e.g., 5 years"
            />
          </div>

          {/* Work History */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-700 font-semibold">Work History</label>
              <button
                type="button"
                onClick={addWorkHistoryField}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Work History
              </button>
            </div>
            {formData.workHistory.map((work, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={work}
                  onChange={(e) => handleWorkHistoryChange(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Previous work experience"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeWorkHistoryField(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Work Images */}
          <div className="space-y-4">
            <label className="text-gray-700 font-semibold block">Work Images (up to 5)</label>
            <input
              type="file"
              name="workImages"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              max="5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {/* Work Images Preview */}
            {previewWorkImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {previewWorkImages.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Work preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-6 bg-green-500 text-white rounded-lg font-semibold ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              } transition-colors`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Gardener...
                </span>
              ) : (
                'Add Gardener'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/gardeners')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Gard_Add;
