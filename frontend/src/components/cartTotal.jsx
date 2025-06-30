/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';

const CartTotal = () => {
  const { currency, cartItems, products, loading } = useContext(ShopContext);
  const deliveryFee = 199; // Fixed delivery fee

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (loading || !products.length) return 0;

    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const product = products.find(p => p._id === itemId);
      if (product) {
        return total + (product.price * quantity);
      }
      return total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + (subtotal > 0 ? deliveryFee : 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">Subtotal</span>
          <span>{currency} {subtotal.toFixed(2)}</span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between items-center text-gray-700">
          <div>
            <span className="font-medium">Delivery Fee</span>
            {subtotal > 0 && (
              <p className="text-sm text-gray-500">Standard Delivery</p>
            )}
          </div>
          <span>{subtotal > 0 ? `${currency} ${deliveryFee.toFixed(2)}` : 'N/A'}</span>
        </div>

        {/* Total */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">
                {currency} {total.toFixed(2)}
              </span>
              <p className="text-sm text-gray-500">Including GST</p>
            </div>
          </div>
        </div>

        {subtotal === 0 && !loading && (
          <div className="text-sm text-gray-500 text-center mt-2">
            Add items to your cart to see the total
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTotal;
