/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const { currency, cartItems, products, loading, updateQuantity, removeFromCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    
    // Calculate cart data from cartItems and products
    const items = Object.entries(cartItems).map(([itemId, quantity]) => {
      const product = products.find(p => p._id === itemId);
      if (!product) return null;
      
      return {
        _id: itemId,
        name: product.name,
        quantity: quantity,
        image: product.images?.[0] || '',
        price: product.price,
        weight: product.weight,
      };
    }).filter(Boolean);
    
    setCartData(items);
  }, [cartItems, products, loading]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // Show confirmation before removing
      if (window.confirm('Remove this item from cart?')) {
        removeFromCart(itemId);
        toast.info('Item removed from cart');
      }
    } else if (newQuantity > 10) {
      toast.warning('Maximum quantity is 10');
      updateQuantity(itemId, 10);
    } else {
      updateQuantity(itemId, newQuantity);
      toast.success('Cart updated');
    }
  };

  const handleRemoveItem = (itemId, itemName) => {
    if (window.confirm(`Remove ${itemName} from cart?`)) {
      removeFromCart(itemId);
      toast.info('Item removed from cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] border-t pt-14">
        <div className="text-2xl mb-8">
          <Title text1={'YOUR '} text2={'CART'} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {[1, 2].map((item) => (
                <div key={item} className="p-6 border-b last:border-b-0">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                    <div className="text-right space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartTotal />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartData.length === 0 && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center border-t pt-14">
        <div className="text-2xl mb-8">
          <Title text1={'YOUR '} text2={'CART'} />
        </div>
        <div className="text-center">
          <div className="mb-8">
            <svg className="w-28 h-28 mx-auto text-emerald-600/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={() => navigate('/shope')}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] border-t pt-14">
      <div className="text-2xl mb-8">
        <Title text1={'YOUR '} text2={'CART'} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {cartData.map((item) => (
              <div
                key={item._id}
                className="p-6 border-b last:border-b-0 hover:bg-gray-50/80 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Product Image and Info */}
                  <div className="flex-shrink-0">
                    <img
                      className="w-24 h-24 object-cover object-center rounded-lg border border-gray-200"
                      src={item.image || 'https://via.placeholder.com/200x200?text=Product+Image'}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=Product+Image';
                      }}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.weight && `Weight: ${item.weight}`}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                          className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
                        />
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id, item.name)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 group"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm font-medium group-hover:text-red-500 transition-colors">Remove</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Price and Subtotal */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-medium text-emerald-600">
                      {currency} {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {currency} {item.price} each
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CartTotal />
            <div className="mt-6 space-y-4">
              <button
                onClick={() => navigate('/shope')}
                className="w-full px-6 py-2.5 text-emerald-600 hover:text-emerald-700 transition-colors border-2 border-emerald-600 hover:border-emerald-700 rounded-xl hover:bg-emerald-50/50 font-medium"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/place-order')}
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-300 shadow-sm hover:shadow-md font-medium"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
