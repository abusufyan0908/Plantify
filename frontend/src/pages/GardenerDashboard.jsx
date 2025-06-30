import { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaClock, FaCertificate, FaLanguage, FaEdit, FaSave, FaUser, FaImage, FaImages } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GardenerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    experience: '',
    hourlyRate: '',
    minimumHours: '',
    certifications: '',
    languages: '',
    bio: '',
    faceImage: null,
    workImages: []
  });
  const [previewUrls, setPreviewUrls] = useState({
    faceImage: null,
    workImages: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gardener/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setProfile(response.data);
        setFormData({
          ...response.data,
          certifications: response.data.certifications?.join(', ') || '',
          languages: response.data.languages?.join(', ') || ''
        });
        setPreviewUrls({
          faceImage: response.data.faceImage,
          workImages: response.data.workImages || []
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('No gardener profile found. Please create your profile.');
        } else {
          setError('Failed to load profile. Please try again later.');
        }
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      ...profile,
      certifications: profile.certifications?.join(', ') || '',
      languages: profile.languages?.join(', ') || ''
    });
    setPreviewUrls({
      faceImage: profile.faceImage,
      workImages: profile.workImages || []
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'faceImage') {
        setFormData(prev => ({ ...prev, faceImage: file }));
        setPreviewUrls(prev => ({ ...prev, faceImage: URL.createObjectURL(file) }));
      } else {
        setFormData(prev => ({
          ...prev,
          workImages: [...prev.workImages, file]
        }));
        setPreviewUrls(prev => ({
          ...prev,
          workImages: [...prev.workImages, URL.createObjectURL(file)]
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'faceImage' && key !== 'workImages') {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/gardener/profile`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setProfile(response.data);
      setFormData({
        ...response.data,
        certifications: response.data.certifications?.join(', ') || '',
        languages: response.data.languages?.join(', ') || ''
      });
      setPreviewUrls({
        faceImage: response.data.faceImage,
        workImages: response.data.workImages || []
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <button
          onClick={() => navigate('/planner')}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-semibold"
        >
          Create Profile
        </button>
      </div>
    );
  }

  if (!profile || !formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 px-6 py-8 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={previewUrls.faceImage || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-white object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700">
                    <FaImage className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'faceImage')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                <p className="text-emerald-100 mt-1">{profile.location}</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center bg-white text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 font-semibold"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-semibold"
                >
                  <FaSave className="mr-2" /> Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-emerald-600 text-xl" />
                  {!isEditing ? (
                    <span>{profile.email || 'Not provided'}</span>
                  ) : (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Email Address"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-emerald-600 text-xl" />
                  {!isEditing ? (
                    <span>{profile.phone || 'Not provided'}</span>
                  ) : (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Phone Number"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-emerald-600 text-xl" />
                  {!isEditing ? (
                    <span>{profile.location || 'Not provided'}</span>
                  ) : (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Location"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaBriefcase className="text-emerald-600 text-xl" />
                  {!isEditing ? (
                    <span>{profile.experience || 'Not provided'} years of experience</span>
                  ) : (
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Years of Experience"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <FaDollarSign className="text-emerald-600 text-xl" />
                  {!isEditing ? (
                    <span>${profile.hourlyRate || 'Not provided'}/hour</span>
                  ) : (
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Hourly Rate ($)"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <FaClock className="text-emerald-600 text-xl" />
                  {!isEditing ? (
                    <span>Minimum {profile.minimumHours || 'Not provided'} hours</span>
                  ) : (
                    <input
                      type="number"
                      name="minimumHours"
                      value={formData.minimumHours}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Minimum Hours"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <FaCertificate className="text-emerald-600 text-xl" />
                  {!isEditing ? (
                    <span>{(profile.certifications && profile.certifications.length > 0) ? profile.certifications.join(', ') : 'No certifications listed'}</span>
                  ) : (
                    <input
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Certifications (comma separated)"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <FaLanguage className="text-emerald-600 text-xl" />
                  {!isEditing ? (
                    <span>{(profile.languages && profile.languages.length > 0) ? profile.languages.join(', ') : 'No languages listed'}</span>
                  ) : (
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Languages (comma separated)"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">About Me</h2>
              {!isEditing ? (
                <p className="text-gray-700">{profile.bio || 'Not provided'}</p>
              ) : (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  rows={4}
                  placeholder="Tell us about yourself and your gardening experience..."
                />
              )}
            </div>

            {/* Work Images */}
            {isEditing && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">Work Images</h2>
                <label className="flex items-center space-x-2 bg-emerald-50 p-3 rounded-lg cursor-pointer hover:bg-emerald-100">
                  <FaImages className="text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Upload Work Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'workImages')}
                    multiple
                    className="hidden"
                  />
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {previewUrls.workImages.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Work sample ${index + 1}`}
                      className="rounded-lg h-32 w-full object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenerDashboard; 