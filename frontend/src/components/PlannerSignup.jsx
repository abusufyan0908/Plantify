import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaClock, FaCertificate, FaLanguage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const PlannerSignup = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // First register the user
      const registerResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'gardener'
        }
      );

      if (registerResponse.data.success) {
        // Immediately log in to get the token
        const loginResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
          {
            email: formData.email,
            password: formData.password
          }
        );
        const { token, user } = loginResponse.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Then create the gardener profile
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (key !== 'profileImage' && key !== 'workImages' && key !== 'password' && key !== 'confirmPassword' && key !== 'email') {
            formDataToSend.append(key, formData[key]);
          }
        });
        formDataToSend.append('email', user.email);

        if (formData.profileImage) {
          formDataToSend.append('faceImage', formData.profileImage);
        }
        
        if (formData.workImages) {
          formData.workImages.forEach(image => {
            formDataToSend.append('workImages', image);
          });
        }

        const gardenerResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/gardener/create`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (gardenerResponse.data.success) {
          const { gardener } = gardenerResponse.data;
          
          setUser(prev => ({
            ...prev,
            isGardener: true,
            gardenerId: gardener._id
          }));

          const currentUser = JSON.parse(localStorage.getItem('user'));
          localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            isGardener: true,
            gardenerId: gardener._id
          }));

          toast.success('Gardener profile created successfully!');
          navigate('/gardener-dashboard');
        }
      }
    } catch (error) {
      console.error('Error creating gardener profile:', error);
      toast.error(error.response?.data?.message || 'Failed to create gardener profile');
    }
  };

  return (
    <div className="bg-white min-h-screen py-12 flex items-center justify-center">
      <div className="rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full border border-gray-200">
        {/* Header */}
        <div className="bg-emerald-500 text-white py-6 px-12 rounded-t-3xl">
          <h1 className="text-3xl font-bold text-center tracking-wide">Become a Gardener</h1>
          <p className="mt-2 text-lg text-center font-semibold">Join our community of professional gardeners</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-semibold text-black mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter your location"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h2 className="text-2xl font-semibold text-black mb-4">Professional Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
                    Years of Experience
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBriefcase className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="experience"
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Enter your years of experience"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hourlyRate">
                    Hourly Rate ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaDollarSign className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="hourlyRate"
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      placeholder="Enter your hourly rate"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minimumHours">
                    Minimum Hours
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="minimumHours"
                      type="number"
                      name="minimumHours"
                      value={formData.minimumHours}
                      onChange={handleInputChange}
                      placeholder="Enter your minimum hours"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="certifications">
                    Certifications (comma separated)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCertificate className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="certifications"
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      placeholder="Enter your certifications"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="languages">
                    Languages (comma separated)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLanguage className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                      id="languages"
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleInputChange}
                      placeholder="Enter your languages"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              placeholder="Tell us about yourself and your gardening experience..."
              required
            />
          </div>

          {/* Images */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-black mb-4">Images</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileImage">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer">
                    <FaUpload className="mr-2" />
                    <span>Upload Profile Picture</span>
                    <input
                      id="profileImage"
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
                      className="h-20 w-20 object-cover rounded-full"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workImages">
                  Work Images
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer">
                    <FaUpload className="mr-2" />
                    <span>Upload Work Images</span>
                    <input
                      id="workImages"
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
                      className="h-24 w-full object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Gardener Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlannerSignup;





