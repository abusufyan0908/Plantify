/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import { IoSearchOutline } from "react-icons/io5";

const Collection = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    subCategories: [],
    priceFilter: '', // Changed from priceRange to simpler priceFilter
    sortBy: 'relevant'
  });

  // Categories and Subcategories matching Product_Add.jsx
  const categories = [
    "Organic Fertilizers",
    "Chemical Fertilizers",
    "Soil Amendments",
    "Soil and Plant Care Tools",
  ];

  const subCategories = {
    "Organic Fertilizers": ["Manure", "Compost", "Seaweed"],
    "Chemical Fertilizers": ["Nitrogen", "Phosphorus", "Potassium"],
    "Soil Amendments": ["Clay", "Sand", "Perlite"],
    "Soil and Plant Care Tools": ["Shovels", "Rakes", "Watering Cans"],
  };

  // Price filter options
  const priceFilters = [
    { label: 'All Prices', value: '' },
    { label: 'Under Rs. 500', value: 'under500' },
    { label: 'Rs. 500 - Rs. 1000', value: '500-1000' },
    { label: 'Rs. 1000 - Rs. 2000', value: '1000-2000' },
    { label: 'Over Rs. 2000', value: 'over2000' }
  ];

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        
        if (response.data.success) {
          const transformedProducts = response.data.products.map(product => ({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            images: product.images || [],
            description: product.description,
            category: product.category,
            subCategory: product.subCategory,
            weight: product.weight
          }));
          
          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
        } else {
          setError('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (showSearch && search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        item.category?.toLowerCase().includes(searchTerm) ||
        item.subCategory?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories.includes(item.category));
    }

    // Apply subcategory filters
    if (filters.subCategories.length > 0) {
      filtered = filtered.filter(item => filters.subCategories.includes(item.subCategory));
    }

    // Apply price filter
    if (filters.priceFilter) {
      filtered = filtered.filter(item => {
        const price = Number(item.price);
        switch (filters.priceFilter) {
          case 'under500':
            return price < 500;
          case '500-1000':
            return price >= 500 && price <= 1000;
          case '1000-2000':
            return price >= 1000 && price <= 2000;
          case 'over2000':
            return price > 2000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order for 'relevant'
        break;
    }

    setFilteredProducts(filtered);
  }, [products, search, showSearch, filters]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      if (type === 'category') {
        const categories = prev.categories.includes(value)
          ? prev.categories.filter(cat => cat !== value)
          : [...prev.categories, value];
        // Clear subcategories when changing categories
        return { ...prev, categories, subCategories: [] };
      }
      if (type === 'subCategory') {
        const subCategories = prev.subCategories.includes(value)
          ? prev.subCategories.filter(sub => sub !== value)
          : [...prev.subCategories, value];
        return { ...prev, subCategories };
      }
      if (type === 'priceFilter') {
        return { ...prev, priceFilter: value };
      }
      if (type === 'sort') {
        return { ...prev, sortBy: value };
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      subCategories: [],
      priceFilter: '',
      sortBy: 'relevant'
    });
  };

  // Get available subcategories based on selected categories
  const getAvailableSubcategories = () => {
    if (filters.categories.length === 0) return [];
    return filters.categories.reduce((acc, category) => {
      return [...acc, ...(subCategories[category] || [])];
    }, []);
  };

  return (
    <div className="container mx-auto px-4">
      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
        {/* Enhanced Filters Sidebar */}
        <div className='lg:w-72 flex-shrink-0'>
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              {/* Search Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowSearch(true);
                    }}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 text-sm sm:text-base"
                  />
                  <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6 sm:mb-8">
                <h3 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">Categories</h3>
                <div className="space-y-2 sm:space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleFilterChange('category', category)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                      />
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-200">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sub Categories */}
              {filters.categories.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">Sub Categories</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {getAvailableSubcategories().map(subCategory => (
                      <label key={subCategory} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.subCategories.includes(subCategory)}
                          onChange={() => handleFilterChange('subCategory', subCategory)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                        />
                        <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-200">{subCategory}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">Price Range</h3>
                <div className="space-y-2 sm:space-y-3">
                  {priceFilters.map(({ label, value }) => (
                    <label key={value} className="flex items-center group cursor-pointer">
                      <input
                        type="radio"
                        checked={filters.priceFilter === value}
                        onChange={() => handleFilterChange('priceFilter', value)}
                        className="rounded-full border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                        name="price-filter"
                      />
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-200">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid Section */}
        <div className='flex-1'>
          {/* Enhanced Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 lg:mb-8 gap-2 sm:gap-4">
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            </p>
            <div className="relative w-full sm:w-auto">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 pr-8 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer hover:border-gray-300 transition-colors duration-200 w-full"
              >
                <option value="relevant">Sort by: Relevant</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-green-200 border-t-green-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
              <div className="text-red-500 text-base sm:text-lg font-medium bg-red-50 px-6 sm:px-8 py-4 sm:py-6 rounded-lg shadow-sm">
                {error}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center bg-gray-50 rounded-xl p-6 sm:p-8">
              <img
                src={assets.empty_icon || "https://via.placeholder.com/150"}
                alt="No products found"
                className="w-32 h-32 sm:w-40 sm:h-40 mb-4 sm:mb-6 opacity-50"
              />
              <p className="text-gray-700 text-lg sm:text-xl font-medium mb-2">No products found</p>
              <p className="text-gray-500 text-sm sm:text-base">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
