import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Gard_List = () => {
  const [gardeners, setGardeners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gardeners
  const fetchGardeners = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gardener'); // singular!
      if (response.data.success) {
        setGardeners(response.data.gardeners);
      }
    } catch (error) {
      console.error('Error fetching gardeners:', error);
      setError('Failed to fetch gardeners');
      toast.error('Error fetching gardeners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGardeners();
  }, []);

  // Delete gardener
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gardener?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/gardener/${id}`); // singular!
        if (response.data.success) {
          toast.success('Gardener deleted successfully');
          fetchGardeners(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting gardener:', error);
        toast.error('Error deleting gardener');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gardeners List</h2>
        <Link
          to="/admin/gardeners/add"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Gardener
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gardeners.map((gardener) => (
          <div
            key={gardener._id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{gardener.name}</h3>
              <div className="flex gap-2">
                <Link
                  to={`/admin/gardeners/edit/${gardener._id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(gardener._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p><strong>Location:</strong> {gardener.location}</p>
              <p><strong>Email:</strong> {gardener.email}</p>
              <p><strong>Phone:</strong> {gardener.phone}</p>
              <p><strong>Experience:</strong> {gardener.experience}</p>
              
              {gardener.faceImage && (
                <img
                  src={gardener.faceImage}
                  alt={`${gardener.name}'s profile`}
                  className="w-32 h-32 object-cover rounded-full"
                />
              )}

              <div>
                <strong>Work History:</strong>
                <ul className="list-disc list-inside">
                  {gardener.workHistory.map((work, index) => (
                    <li key={index}>{work}</li>
                  ))}
                </ul>
              </div>

              {gardener.workImages && gardener.workImages.length > 0 && (
                <div>
                  <strong>Work Images:</strong>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {gardener.workImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Work sample ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gard_List;

export const getAllGardeners = async (req, res) => {
  // ...fetch all gardeners logic
};

export const deleteGardener = async (req, res) => {
  // ...delete gardener by id logic
};