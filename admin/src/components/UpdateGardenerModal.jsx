import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateGardenerModal = ({ gardener, onClose, onUpdate }) => {
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

  useEffect(() => {
    if (gardener) {
      setFormData({
        ...gardener,
        faceImage: null,
        workImages: []
      });
    }
  }, [gardener]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkHistoryChange = (index, value) => {
    const newWorkHistory = [...formData.workHistory];
    newWorkHistory[index] = value;
    setFormData(prev => ({
      ...prev,
      workHistory: newWorkHistory
    }));
  };

  const addWorkHistoryField = () => {
    setFormData(prev => ({
      ...prev,
      workHistory: [...prev.workHistory, '']
    }));
  };

  const removeWorkHistoryField = (index) => {
    const newWorkHistory = formData.workHistory.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      workHistory: newWorkHistory
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'faceImage') {
      setFormData(prev => ({
        ...prev,
        faceImage: files[0]
      }));
    } else if (name === 'workImages') {
      setFormData(prev => ({
        ...prev,
        workImages: Array.from(files)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'workHistory') {
          formDataToSend.append(key, JSON.stringify(formData[key].filter(item => item !== '')));
        } else if (key !== 'faceImage' && key !== 'workImages' && key !== '_id') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.faceImage) {
        formDataToSend.append('faceImage', formData.faceImage);
      }
      
      if (formData.workImages.length > 0) {
        formData.workImages.forEach(image => {
          formDataToSend.append('workImages', image);
        });
      }

      const response = await axios.put(
        `http://localhost:5000/api/gardener/${gardener._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Gardener updated successfully!');
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error updating gardener:', error);
      toast.error(error.response?.data?.message || 'Error updating gardener');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Update Gardener</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Bio and Experience */}
          <div>
            <label className="block mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Work History */}
          <div className="space-y-2">
            <label className="block mb-1">Work History</label>
            {formData.workHistory.map((work, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={work}
                  onChange={(e) => handleWorkHistoryChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Previous work experience"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeWorkHistoryField(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addWorkHistoryField}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Work History
            </button>
          </div>

          {/* Image Uploads */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Face Image (Optional)</label>
              <input
                type="file"
                name="faceImage"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Work Images (Optional, up to 5)</label>
              <input
                type="file"
                name="workImages"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                max="5"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 bg-green-500 text-white rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              }`}
            >
              {loading ? 'Updating...' : 'Update Gardener'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGardenerModal; 