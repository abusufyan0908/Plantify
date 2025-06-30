/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import assets from '../assets/assets';
import RelatedProduct from '../components/RelatedProduct';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');

  useEffect(() => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  if (!productData) return <div>Product not found!</div>;

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-md hover:scale-105 transition-transform"
                alt={`Product Image ${index + 1}`}
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[81.3%]">
            <img src={image} className="w-full h-auto rounded-md shadow-md" alt="Selected Product" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-semibold text-3xl">{productData.name}</h1>
          <p className="mt-5 text-3xl font-semibold text-black">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-700 md:w-4/5">{productData.description}</p>

          {/* 🔥 FIXED: Ensuring Weight Options Show Properly */}
          <div className="mt-6">
            <p className="text-lg font-medium text-gray-800">Select Weight:</p>
            {productData.weights && productData.weights.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {productData.weights.map((weight, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium transition-all ${
                      selectedWeight === weight
                        ? 'bg-black text-white border-black'
                        : 'hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedWeight(weight)}
                  >
                    {weight} kg
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-gray-600">No weight options available for this product.</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(productData._id, selectedWeight)}
            className={`bg-black text-white mt-8 px-10 py-3 text-md rounded-lg transition-all ${
              !selectedWeight ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
            disabled={!selectedWeight}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
