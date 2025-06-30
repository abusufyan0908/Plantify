import { useState, useContext } from 'react';
import { IoCartOutline, IoPersonOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { FaLeaf, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, handleLogout } = useAuth();
  const { getCartCount } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      handleLogout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      handleLogout();
      navigate('/login');
    }
  };

  const LogoutConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowLogoutConfirm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowLogoutConfirm(false);
              handleLogoutClick();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showLogoutConfirm && <LogoutConfirmationDialog />}
      <div className="flex items-center justify-between mt-3 py-4 px-4 sm:px-5 font-medium bg-white sticky top-0 z-30 rounded-b-xl shadow-md">
        <Link to="/" className="flex items-center">
          <div className="text-2xl sm:text-3xl font-bold text-gray-700">Plantify Hub</div>
        </Link>

        <div className="hidden sm:flex items-center gap-6 lg:gap-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? "text-emerald-600" : "hover:text-emerald-600 transition-colors duration-200"
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/shope" 
            className={({ isActive }) => 
              isActive ? "text-emerald-600" : "hover:text-emerald-600 transition-colors duration-200"
            }
          >
            Shop
          </NavLink>
          <NavLink 
            to="/chatbot" 
            className={({ isActive }) => 
              isActive ? "text-emerald-600" : "hover:text-emerald-600 transition-colors duration-200"
            }
          >
            Chatbot
          </NavLink>
          <NavLink 
            to="/planner" 
            className={({ isActive }) => 
              isActive ? "text-emerald-600" : "hover:text-emerald-600 transition-colors duration-200"
            }
          >
            Planner
          </NavLink>
          <NavLink 
            to="/plantid" 
            className={({ isActive }) => 
              isActive ? "text-emerald-600" : "hover:text-emerald-600 transition-colors duration-200"
            }
          >
            Plant Ident
          </NavLink>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {user ? (
            <div className="group relative z-30">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200">
                <IoPersonOutline className="w-5 h-5" />
                <span className="hidden sm:inline">{user.username}</span>
              </button>
              <div className="group-hover:block hidden absolute right-0 pt-4">
                <div className="flex flex-col gap-2 w-48 py-3 px-5 bg-white text-gray-500 rounded-lg shadow-lg border border-gray-100">
                  <div className="border-b pb-2">
                    <p className="font-semibold text-black">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 cursor-pointer hover:text-emerald-600 transition-colors duration-200"
                  >
                    <FaUser className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link 
                    to={user.role === 'gardener' ? '/gardener-dashboard' : '/planner-dashboard'} 
                    className="flex items-center space-x-2 cursor-pointer hover:text-emerald-600 transition-colors duration-200"
                  >
                    <FaCog className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/orders" 
                    className="flex items-center space-x-2 cursor-pointer hover:text-emerald-600 transition-colors duration-200"
                  >
                    <IoCartOutline className="w-4 h-4" />
                    <span>My Orders</span>
                  </Link>
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center space-x-2 text-left cursor-pointer hover:text-red-600 transition-colors duration-200 mt-2 border-t pt-2"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
            >
              <IoPersonOutline className="w-5 h-5" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}

          <Link to="/cart" className="relative">
            <IoCartOutline className="w-5 h-5 min-w-5" />
            {getCartCount() > 0 && (
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-emerald-600 text-white aspect-square rounded-full text-[8px]">
                {getCartCount()}
              </p>
            )}
          </Link>
          <IoMenuOutline onClick={() => setVisible(true)} className="w-6 h-6 cursor-pointer sm:hidden" />
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed top-0 right-0 bottom-0 left-0 bg-white z-50 transition-all duration-300 ease-in-out transform ${
            visible ? 'translate-x-0' : 'translate-x-full'
          } sm:hidden`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Menu</h2>
              <IoCloseOutline 
                onClick={() => setVisible(false)} 
                className="w-6 h-6 cursor-pointer"
              />
            </div>
            <div className="flex flex-col text-gray-600 overflow-y-auto">
              <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b hover:bg-gray-50 transition-colors duration-200" to="/">Home</NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b hover:bg-gray-50 transition-colors duration-200" to="/shope">Shop</NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b hover:bg-gray-50 transition-colors duration-200" to="/chatbot">Chatbot</NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b hover:bg-gray-50 transition-colors duration-200" to="/planner">Planner</NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b hover:bg-gray-50 transition-colors duration-200" to="/plantid">Plant Ident</NavLink>
              {user ? (
                <div className="py-4 px-6 border-b space-y-4">
                  <div className="border-b pb-2">
                    <p className="font-semibold text-black">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="block hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setVisible(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to={user.role === 'gardener' ? '/gardener-dashboard' : '/planner-dashboard'} 
                    className="block hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setVisible(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setVisible(false)}
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={() => {
                      setVisible(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="text-left text-red-600 hover:text-red-700 transition-colors duration-200 w-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink 
                  onClick={() => setVisible(false)} 
                  className="py-4 px-6 border-b hover:bg-gray-50 transition-colors duration-200" 
                  to="/login"
                >
                  Login / Sign Up
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
