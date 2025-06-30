import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Title from './Title';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaUser, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddReviewForm from './AddReviewForm';

// Dummy reviews data
const dummyReviews = [
  {
    id: 1,
    user: 'PlantLover123',
    rating: 5,
    date: '2024-03-15',
    comment: 'This plant is absolutely beautiful! It arrived in perfect condition and has been thriving in my living room. The care instructions were very helpful.',
    image: 'https://placehold.co/300x300/e2e8f0/475569?text=Review+1'
  },
  {
    id: 2,
    user: 'GreenThumb',
    rating: 4,
    date: '2024-03-10',
    comment: 'Great quality plant. The leaves are vibrant and healthy. Would recommend to any plant enthusiast.',
    image: 'https://placehold.co/300x300/e2e8f0/475569?text=Review+2'
  },
  {
    id: 3,
    user: 'NatureEnthusiast',
    rating: 5,
    date: '2024-03-05',
    comment: 'I\'m very happy with my purchase. The plant was well-packaged and arrived quickly. It\'s growing beautifully in my garden.',
    image: 'https://placehold.co/300x300/e2e8f0/475569?text=Review+3'
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist = [] } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isInWishlist = useMemo(() => {
    return product ? wishlist.some(item => item._id === product._id) : false;
  }, [product, wishlist]);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/single/${id}`);
      
      if (response.data.success && response.data.product) {
        const productData = response.data.product;
        setProduct(productData);
        if (productData.images && productData.images.length > 0) {
          setSelectedImage(productData.images[0]);
        }
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error loading product details:', error);
      if (error.response?.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to load product details');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    
    addToCart({
      id: product._id,
      name: product.name,
      image: selectedImage || product.images?.[0],
      price: product.price,
      quantity,
      weight: product.weight
    });
    toast.success('Product added to cart!');
  }, [product, selectedImage, quantity, addToCart]);

  const handleWishlistToggle = useCallback(() => {
    if (!product) return;
    
    if (isInWishlist) {
      removeFromWishlist(product._id);
      toast.info('Product removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Product added to wishlist!');
    }
  }, [product, isInWishlist, addToWishlist, removeFromWishlist]);

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  }, [product?.stock]);

  const renderStars = useCallback((rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  }, []);

  const ReviewsSection = ({ reviews }) => {
    return (
      <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-6 sm:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Customer Reviews</h2>
        <div className="space-y-4 sm:space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{review.user}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className="w-4 h-4 sm:w-5 sm:h-5">
                      {index < review.rating ? (
                        <FaStar className="text-yellow-400 w-full h-full" />
                      ) : (
                        <FaRegStar className="text-yellow-400 w-full h-full" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{review.comment}</p>
              {review.image && (
                <div className="mt-3 sm:mt-4">
                  <img
                    src={review.image}
                    alt={`Review by ${review.user}`}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/300x300/e2e8f0/475569?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleAddReview = useCallback((reviewData) => {
    // For now, we'll just add it to the dummy reviews
    const newReview = {
      id: dummyReviews.length + 1,
      user: 'Current User', // This would be replaced with actual user data
      rating: reviewData.rating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewData.comment,
      image: reviewData.image
    };
    
    dummyReviews.unshift(newReview);
    toast.success('Review added successfully!');
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>
        <div className="text-center">
          <div className="text-red-500 text-base sm:text-lg font-medium bg-red-50 px-4 sm:px-6 py-3 sm:py-4 rounded-lg inline-block">
            {error || 'Product not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 sm:mb-6 flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Images */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={selectedImage || product.images?.[0] || 'https://placehold.co/500x500/e2e8f0/475569?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/500x500/e2e8f0/475569?text=No+Image';
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    selectedImage === image ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/500x500/e2e8f0/475569?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{product.name}</h1>
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="flex mr-2">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm sm:text-base text-gray-500">({product.reviews?.length || 0} reviews)</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-emerald-600 mb-3 sm:mb-4">
              Rs {product.price}
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{product.description}</p>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock || 10}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-12 text-center border-x py-2 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm sm:text-base text-gray-500">
                  {product.stock || 10} in stock
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className="flex items-center justify-center px-4 py-2.5 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors duration-300"
                >
                  {isInWishlist ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reviews</h2>
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 text-sm sm:text-base"
            >
              <FaPlus className="mr-2" />
              Add Review
            </button>
          </div>
          <ReviewsSection reviews={dummyReviews} />
        </div>
      </div>

      {showReviewForm && (
        <AddReviewForm
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
};

export default ProductDetail; 