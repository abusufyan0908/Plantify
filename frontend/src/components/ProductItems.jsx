import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import RelatedProduct from './RelatedProduct';

const ProductItems = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        console.log('Fetching product details for ID:', id);
        console.log('Full URL:', `${backendUrl}/api/products/single/${id}`);

        const response = await axios.get(`${backendUrl}/api/products/single/${id}`);
        console.log('API Response:', response.data);
        
        if (response.data.success && response.data.product) {
          const productData = response.data.product;
          console.log('Product data:', productData);
          
          // Validate required fields
          if (!productData.name || !productData._id) {
            console.error('Invalid product data:', productData);
            setError('Invalid product data received');
            return;
          }

          setProduct(productData);
          // Set the first image as selected image
          if (productData.images && productData.images.length > 0) {
            setSelectedImage(productData.images[0]);
          }
          toast.success('Product loaded successfully');
        } else {
          console.error('API returned error:', response.data);
          setError(response.data.message || 'Product not found');
          toast.error('Error loading product details');
        }
      } catch (error) {
        console.error('Error fetching product:', error.response || error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      // Scroll to top when component mounts
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleAddToCart = () => {
    addToCart(id);
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-red-500 text-lg font-medium bg-red-50 px-6 py-4 rounded-lg">
            {error || 'Product not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 sm:mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {/* Product Images */}
        <div className="space-y-3 sm:space-y-4">
          <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
            <img
              src={selectedImage || (product.images && product.images[0]) || 'https://via.placeholder.com/500x500?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
              }}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 ${
                    selectedImage === image ? 'border-green-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 sm:mt-4">
              <span className="text-xl sm:text-2xl font-bold text-green-600">Rs {product.price}</span>
              {product.weight && (
                <span className="ml-2 text-sm sm:text-base text-gray-500">/ {product.weight}</span>
              )}
            </div>
          </div>

          {product.description && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Description</h2>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Quantity</h2>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <span className="text-lg sm:text-xl">-</span>
              </button>
              <span className="text-lg sm:text-xl font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                <span className="text-lg sm:text-xl">+</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {product.category && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium bg-gray-100 text-gray-600 rounded-full">
                {product.category}
              </span>
            )}
            {product.subCategory && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium bg-green-100 text-green-600 rounded-full">
                {product.subCategory}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white text-sm sm:text-base rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {product.category && product.subCategory && (
        <div className="mt-8 sm:mt-16">
          <RelatedProduct
            category={product.category}
            subCategory={product.subCategory}
            currentProductId={product._id}
          />
        </div>
      )}
    </div>
  );
};

export default ProductItems;
