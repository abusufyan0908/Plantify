import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaClock, FaCertificate, FaLanguage, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    experience: '',
    bio: '',
    hourlyRate: '',
    minimumHours: '',
    specialties: '',
    certifications: '',
    languages: '',
    profileImage: null,
    workImages: []
  });

  const [previewUrls, setPreviewUrls] = useState({
    profile: null,
    work: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profile') {
        setFormData(prev => ({ ...prev, profileImage: file }));
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrls(prev => ({ ...prev, profile: previewUrl }));
      } else {
        setFormData(prev => ({
          ...prev,
          workImages: [...prev.workImages, file]
        }));
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrls(prev => ({
          ...prev,
          work: [...prev.work, previewUrl]
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'profileImage' && key !== 'workImages') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      
      if (formData.workImages.length > 0) {
        formData.workImages.forEach(image => {
          formDataToSend.append('workImages', image);
        });
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${user.role}/profile`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Profile created successfully!');
        navigate(`/${user.role}/dashboard`);
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-8 text-center">
            <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
            <p className="mt-2 text-emerald-100">Tell us more about yourself</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    required
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBriefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Years of Experience"
                    required
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="Hourly Rate ($)"
                    required
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="minimumHours"
                    value={formData.minimumHours}
                    onChange={handleInputChange}
                    placeholder="Minimum Hours"
                    required
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCertificate className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    placeholder="Certifications (comma separated)"
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLanguage className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    placeholder="Languages (comma separated)"
                    className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about yourself and your experience..."
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Images */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-emerald-50 p-3 rounded-lg hover:bg-emerald-100 transition-colors">
                    <FaUpload className="inline mr-2 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Upload Profile Picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'profile')}
                      className="hidden"
                    />
                  </label>
                  {previewUrls.profile && (
                    <img
                      src={previewUrls.profile}
                      alt="Profile preview"
                      className="h-20 w-20 object-cover rounded-lg border-2 border-emerald-200"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Images</label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-emerald-50 p-3 rounded-lg hover:bg-emerald-100 transition-colors">
                    <FaUpload className="inline mr-2 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Upload Work Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'work')}
                      multiple
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {previewUrls.work.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Work preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg border-2 border-emerald-200"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-900 transition-colors font-medium"
              >
                Complete Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup; 