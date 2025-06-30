import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Title from './Title';
import axios from 'axios';
import PropTypes from 'prop-types';

const RelatedProduct = ({ category, subCategory }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        
        if (response.data.success) {
          const allProducts = response.data.products;
          const relatedProducts = allProducts
            .filter(product => 
              product.category === category && 
              product.subCategory === subCategory
            )
            .slice(0, 4); // Limit to 4 related products
          
          setRelated(relatedProducts);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category && subCategory) {
      fetchRelatedProducts();
    }
  }, [category, subCategory]);

  if (loading || related.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 mb-8">
      <div className="text-center mb-8">
        <Title text1="Related" text2="Products" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product) => (
          <Link 
            key={product._id}
            to={`/product/${product._id}`}
            className="group block"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-green-600">
                  Rs {product.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

RelatedProduct.propTypes = {
  category: PropTypes.string.isRequired,
  subCategory: PropTypes.string.isRequired,
};

export default RelatedProduct;
