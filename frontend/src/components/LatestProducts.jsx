import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from './Title';
import ProductCard from './ProductCard';

const LatestProducts = () => {
  const { products } = useContext(ShopContext);
  const [latestProd, setLatestProd] = useState([]);

  useEffect(() => {
    // Ensure products is not empty or undefined
    if (products && products.length > 0) {
      setLatestProd(products.slice(0, 10));
    }
  }, [products]); // Add products as a dependency

  return (
    <div className='my-10'>
      <div className='text-center py-8'>
        <Title text1={'LATEST '} text2={'PRODUCTS'} />
      </div>
      
      {/* Display products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
        {
          latestProd.map((item, index) => (
            <ProductCard
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))
        }
      </div>
    </div>
  );
};

export default LatestProducts;
