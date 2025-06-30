/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom'; // For navigation
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS styles

const Bestseller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestseller] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProduct = products.filter((item) => item.bestseller);
      setBestseller(bestProduct.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="my-16 w-full py-12 bg-white rounded-lg shadow-lg">
      {/* Section Introduction */}
      <div className="text-center mb-12 px-4" data-aos="fade-up">
        <h2 className="text-4xl font-extrabold text-[#2f4f4f]">
          Bestselling Products
        </h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 px-8">
        {bestSeller.map((item, index) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300 relative"
            data-aos="zoom-in"
            data-aos-delay={index * 200} // Delays each item for a staggered effect
          >
            {/* Product Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-56 object-cover group-hover:opacity-50 transition-opacity duration-300"
            />
            
            {/* Product Info (Visible on hover) */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-center text-white px-4">
                <h3 className="text-base font-semibold">{item.name}</h3>
                <p className="text-sm font-medium mt-2">Rs {item.price}</p>
                <Link
                  to={`/product/${item._id}`}
                  className="inline-block mt-4 px-6 py-2 bg-[#2f4f4f] text-white rounded-md text-sm font-medium transition-all duration-300 hover:bg-[#4b6f52] hover:shadow-lg"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore All Button */}
      <div className="text-center mt-12" data-aos="fade-up">
        <Link
          to="/shope"
          className="inline-block px-12 py-4 bg-[#2f4f4f] text-white text-xl font-bold rounded-lg shadow-lg border-2 border-black hover:bg-[#4b6f52] hover:shadow-xl transition-all duration-300"
        >
          Explore All Products
        </Link>
      </div>
    </div>
  );
};

export default Bestseller;
