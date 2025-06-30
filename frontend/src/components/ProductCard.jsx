import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductCard = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);
    const displayImage = Array.isArray(image) && image.length > 0 
        ? image[0] 
        : (typeof image === 'string' ? image : 'https://via.placeholder.com/300x300?text=No+Image');

    // Ensure the ID is a string
    const productId = id?.toString();

    if (!productId) {
        console.error('Invalid product ID:', id);
        return null;
    }

    return (
        <Link 
            className='group relative block bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden' 
            to={`/product/${productId}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            {/* Quick Add Button - Appears on Hover */}
            <div className="absolute inset-x-0 top-0 h-full bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 z-10" />
            
            {/* Product Image */}
            <div className='aspect-square overflow-hidden bg-gray-100 rounded-t-xl sm:rounded-t-2xl'>
                <img 
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
                    src={displayImage} 
                    alt={name}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
            </div>

            {/* Product Info */}
            <div className="p-3 sm:p-4">
                <h3 className='font-medium text-sm sm:text-base text-gray-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 min-h-[2.5rem]'>
                    {name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                    <p className='text-base sm:text-lg font-bold text-emerald-600'>
                        {currency} {price}
                    </p>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-emerald-600 hover:bg-emerald-700 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        View Details
                    </button>
                </div>
            </div>
        </Link>
    );
};

ProductCard.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
};

export default ProductCard; 