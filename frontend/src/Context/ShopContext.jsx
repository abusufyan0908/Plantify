/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { products } from '../assets/assets';

export const ShopContext = createContext(null);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopContextProvider');
  }
  return context;
};

const ShopContextProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const currency = 'Rs';
    const delivery_fee = 199;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        // Load cart from localStorage on initial render
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : {};
    });
    const [selectedWeight, setSelectedWeight] = useState([]); // New state for weight filtering

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
                if (response.data.success) {
                    setProducts(response.data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Function to add an item to the cart with weight selection
    const addToCart = (item) => {
        setCartItems((prev) => ({
            ...prev,
            [item.id]: (prev[item.id] || 0) + (item.quantity || 1)
        }));
    };

    // Function to update quantity of an item in the cart
    const updateQuantity = (itemId, newQuantity) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (newQuantity <= 0) {
                delete updatedCart[itemId];
            } else {
                updatedCart[itemId] = newQuantity;
            }
            return updatedCart;
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            delete updatedCart[itemId];
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCartItems({});
    };

    // Function to get the total number of items in the cart
    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    };

    // Function to get the total amount of items in the cart
    const getCartAmount = () => {
        if (!products || products.length === 0 || !cartItems) return 0;

        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const product = products.find(p => p._id === itemId);
            if (!product) return total;
            return total + (product.price * quantity);
        }, 0);
    };

    const getCartTotal = () => {
        if (loading || !products || products.length === 0) return "0.00";
        
        const subtotal = getCartAmount();
        const total = subtotal + (subtotal > 0 ? delivery_fee : 0);
        return total.toFixed(2);
    };

    const getCartItems = () => {
        if (!products || products.length === 0) return [];

        return Object.entries(cartItems)
            .map(([itemId, quantity]) => {
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
            })
            .filter(Boolean);
    };

    const value = {
        products,
        loading,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        selectedWeight,
        setSelectedWeight,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItems,
    };

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
