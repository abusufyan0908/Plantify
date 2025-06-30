/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
import { ShopContext } from "../Context/ShopContext";
import { orderService } from "../services/orderService";

const OrderSuccessModal = ({ onClose, onViewOrders, onContinueShopping }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order Placed Successfully!</h3>
        <p className="text-sm text-gray-500 mb-6">
          Thank you for your order. You can view your order details or continue shopping.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onViewOrders}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            View Orders
          </button>
          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, products } = useContext(ShopContext);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zip', 'country', 'phone'];
    const emptyFields = requiredFields.filter(field => !form[field].trim());
    
    if (emptyFields.length > 0) {
      toast.error(`Please fill in: ${emptyFields.join(', ')}`);
      return false;
    }
    
    if (!form.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const prepareOrderData = () => {
    // Debug logs for user data
    const userDataRaw = localStorage.getItem('user');
    console.log('Raw user data from localStorage:', userDataRaw);
    
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Parsed user data:', userData);

    if (!userData._id) {
      throw new Error('User ID not found');
    }

    const orderItems = Object.entries(cartItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find(p => p._id === productId);
        if (!product) return null;
        return {
          product: productId,
          quantity: Number(quantity),
          price: product.price
        };
      })
      .filter(Boolean);

    const orderData = {
      userId: userData._id.toString(), // Ensure userId is a string
      orderItems: orderItems,
      shippingAddress: {
        fullName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        address: form.street,
        city: form.city,
        state: form.state,
        postalCode: form.zip,
        country: form.country,
        phoneNo: form.phone
      },
      paymentMethod: method,
      totalAmount: Number(getCartTotal()),
      orderStatus: "pending"
    };

    console.log('Final order data:', orderData);
    return orderData;
  };

  const handlePlaceOrder = async () => {
    try {
      if (!validateForm()) return;

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to place an order");
        navigate("/login");
        return;
      }

      // Debug: Check user data before proceeding
      const userDataRaw = localStorage.getItem('user');
      console.log('User data in localStorage:', userDataRaw);
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Parsed user data in handlePlaceOrder:', userData);

      if (!userData._id) {
        console.log('No user ID found, clearing storage and redirecting');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error("User information not found. Please login again");
        navigate("/login");
        return;
      }

      if (Object.keys(cartItems).length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      setIsSubmitting(true);
      const orderData = prepareOrderData();
      
      console.log('Sending order data:', orderData);

      const response = await orderService.createOrder(orderData, token);
      console.log('Order response:', response);

      if (response.success) {
        toast.success(response.message || 'Order placed successfully!');
        clearCart();
        setShowSuccessModal(true);
      } else {
        // Show more detailed error message
        const errorMessage = response.error || response.message || 'Failed to create order';
        toast.error(errorMessage);
        console.error('Order creation failed:', response);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error(error.message || "Failed to place order. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewOrders = () => {
    setShowSuccessModal(false);
    navigate("/orders");
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    navigate("/shop");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Delivery Information */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Title text1="DELIVERY" text2="INFORMATION" />
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={form.street}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP Code"
                  value={form.zip}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Method and Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Title text1="PAYMENT" text2="METHOD" />
            <div className="mt-6 space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="cod"
                  checked={method === "cod"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="form-radio text-green-500"
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="card"
                  checked={method === "card"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="form-radio text-green-500"
                />
                <span>Credit/Debit Card</span>
              </label>
            </div>

            <div className="mt-6">
              <CartTotal />
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className={`w-full mt-4 py-3 px-4 rounded-lg text-white font-medium
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <OrderSuccessModal
          onClose={() => setShowSuccessModal(false)}
          onViewOrders={handleViewOrders}
          onContinueShopping={handleContinueShopping}
        />
      )}
    </div>
  );
};

export default PlaceOrder;
