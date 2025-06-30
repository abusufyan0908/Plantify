import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Gard_Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(true);
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

  // Fetch gardener data
  useEffect(() => {
    const fetchGardener = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/gardeners/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          const gardener = response.data.gardener;
          setFormData({
            ...gardener,
            faceImage: null, // Reset file inputs
            workImages: []
          });
        }
      } catch (error) {
        console.error('Error fetching gardener:', error);
        toast.error('Error fetching gardener data');
        navigate('/admin/gardeners');
      } finally {
        setLoading(false);
      }
    };

    fetchGardener();
  }, [id, navigate]);

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
    } else if (name === 'workImages') {
      setFormData(prev => ({
        ...prev,
        workImages: Array.from(files)
      }));
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
        } else if (key !== 'faceImage' && key !== 'workImages' && key !== '_id') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append files only if new ones are selected
      if (formData.faceImage) {
        formDataToSend.append('faceImage', formData.faceImage);
      }
      
      if (formData.workImages.length > 0) {
        formData.workImages.forEach(image => {
          formDataToSend.append('workImages', image);
        });
      }

      const response = await axios.put(
        `${backendUrl}/api/gardeners/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (response.data.success) {
        toast.success('Gardener updated successfully!');
        navigate('/admin/gardeners');
      }
    } catch (error) {
      console.error('Error updating gardener:', error);
      toast.error(error.response?.data?.message || 'Error updating gardener');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Gardener</h2>
      {/* Use the same form structure as Gard_Add.jsx, but with the formData values pre-filled */}
      {/* Copy the form JSX from Gard_Add.jsx and adjust the button text to "Update Gardener" */}
    </div>
  );
};

export default Gard_Edit; 