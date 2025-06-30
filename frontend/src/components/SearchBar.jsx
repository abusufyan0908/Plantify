import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets';

const SearchBar = () => {
    const location = useLocation(); // Get the current location
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

    // Only render the search bar if on the shop page
    const isShopPage = location.pathname === '/shope';

    return isShopPage && showSearch ? (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg mt-3 shadow-md max-w-lg mx-auto">
            <div className="relative w-full">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 px-12 py-3 rounded-full text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-800 transition duration-300 ease-in-out"
                    type="text"
                    placeholder="Search for products..."
                />
                <img
                    src={assets.search_icon}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 opacity-80 hover:opacity-100 transition duration-200"
                    alt="Search Icon"
                />
            </div>
            <img
                onClick={() => setShowSearch(false)}
                src={assets.cross_icon}
                className="ml-4 w-5 cursor-pointer opacity-70 hover:opacity-100 transition duration-200"
                alt="Close Icon"
            />
        </div>
    ) : null;
};

export default SearchBar;
