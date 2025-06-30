import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaClock, FaCertificate, FaLanguage, FaEdit, FaBell, FaComments, FaHistory, FaUpload } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${user.role}/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.data.success) {
          setProfile(response.data.profile);
          setFormData(response.data.profile);
          setPreviewUrls({
            profile: response.data.profile.profileImage,
            work: response.data.profile.workImages || []
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${user.role}/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchProfile();
    fetchOrders();
    fetchMessages();
  }, [user.role]);

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
        setProfile(response.data.profile);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img
                src={previewUrls.profile || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
                <p className="text-sm text-gray-500">{user.role === 'gardener' ? 'Professional Gardener' : 'Garden Planner'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <FaBell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <FaComments className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <nav className="space-y-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                    activeTab === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaUser className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                    activeTab === 'orders' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaHistory className="h-5 w-5" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                    activeTab === 'messages' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaComments className="h-5 w-5" />
                  <span>Messages</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
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
                      <div className="space-y-4">
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

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <FaUser className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{formData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{formData.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <FaBriefcase className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium">{formData.experience} years</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaDollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Hourly Rate</p>
                          <p className="font-medium">${formData.hourlyRate}/hour</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaClock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Minimum Hours</p>
                          <p className="font-medium">{formData.minimumHours} hours</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaCertificate className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Certifications</p>
                          <p className="font-medium">{formData.certifications}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaLanguage className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Languages</p>
                          <p className="font-medium">{formData.languages}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                  <p className="text-gray-600">{formData.bio}</p>
                </div>

                {previewUrls.work && previewUrls.work.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Work Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previewUrls.work.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Work ${index + 1}`}
                          className="h-48 w-full object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-500">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{order.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Messages</h2>
                {messages.length === 0 ? (
                  <p className="text-gray-500">No messages yet</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message._id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={message.sender.profileImage || 'https://via.placeholder.com/150'}
                            alt={message.sender.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{message.sender.name}</p>
                            <p className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600">{message.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 