import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(null); // For storing product data to be updated
  const [updateData, setUpdateData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subCategory: "",
    quantity: "",
    Bestseller: false
  });
  const navigate = useNavigate();

  // Categories and Subcategories (add these constants)
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

  const fetchList = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await axios.get(backendUrl + "/api/products", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setList(response.data.products);
      } else {
        setError("No products found.");
      }
    } catch (error) {
      if (error.response && error.response.data.message === 'Invalid or expired token') {
        setError("Session expired. Please log in again.");
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError("Failed to fetch the product list. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You need to be logged in to remove a product.");
        return;
      }
  
      const response = await axios.delete(`${backendUrl}/api/products/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();  // Refresh the product list after deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove the product.");
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({
      ...updateData,
      [name]: value,
    });
  };

  const updateProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You need to be logged in to update a product.");
        return;
      }

      // Create the update payload
      const updatePayload = {
        ...updateData,
        price: Number(updateData.price),
        quantity: Number(updateData.quantity)
      };

      const response = await axios.put(
        `${backendUrl}/api/products/update/${currentProduct._id}`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        setCurrentProduct(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update the product.");
    }
  };

  const openUpdateModal = (product) => {
    setCurrentProduct(product);
    setUpdateData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      subCategory: product.subCategory,
      quantity: product.quantity || "",
      Bestseller: product.Bestseller || false
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return <div className="text-center text-xl py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Product List</h2>
              <p className="text-gray-600 mt-1">Manage your products and inventory</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xl text-gray-700">Loading products...</span>
            </div>
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="max-w-sm mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-4">Start by adding your first product to the inventory.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 rounded-t-lg bg-gradient-to-b from-gray-50 to-gray-100">
                  <img
                    src={Array.isArray(product.images) && product.images.length > 0 
                      ? product.images[0] 
                      : 'https://via.placeholder.com/400x300'}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  {product.Bestseller && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-sm text-gray-900 px-3 py-1 rounded-full font-semibold">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                      <p className="text-2xl font-bold text-teal-600 mt-1">
                        {currency}{product.price}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openUpdateModal(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeProduct(product._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {product.category} - {product.subCategory}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Stock: {product.quantity} units
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                  </div>

                  {/* Product Images Grid */}
                  {product.images && product.images.length > 1 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {product.images.slice(1).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.name} ${index + 2}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {currentProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Update Product</h3>
                <button
                  onClick={() => setCurrentProduct(null)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-700 font-semibold">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={updateData.name}
                    onChange={handleUpdateChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-semibold">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={updateData.price}
                    onChange={handleUpdateChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter price"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-semibold">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={updateData.quantity}
                    onChange={handleUpdateChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter quantity"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-semibold">Category</label>
                  <select
                    name="category"
                    value={updateData.category}
                    onChange={handleUpdateChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    name="subCategory"
                    value={updateData.subCategory}
                    onChange={handleUpdateChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={!updateData.category}
                  >
                    <option value="">Select subcategory</option>
                    {updateData.category && subCategories[updateData.category]?.map((subCat, index) => (
                      <option key={index} value={subCat}>{subCat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-gray-700 font-semibold">Bestseller</label>
                  <input
                    type="checkbox"
                    name="Bestseller"
                    checked={updateData.Bestseller}
                    onChange={(e) => setUpdateData(prev => ({
                      ...prev,
                      Bestseller: e.target.checked
                    }))}
                    className="h-5 w-5 text-teal-500 rounded focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-gray-700 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={updateData.description}
                  onChange={handleUpdateChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter product description"
                />
              </div>

              {/* Current Images Preview */}
              {currentProduct.images && currentProduct.images.length > 0 && (
                <div className="space-y-2">
                  <label className="text-gray-700 font-semibold">Current Images</label>
                  <div className="grid grid-cols-4 gap-4">
                    {currentProduct.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setCurrentProduct(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateProduct}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
