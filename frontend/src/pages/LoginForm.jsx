/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-5 rounded-lg flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p className="mt-3 text-gray-800">Please wait...</p>
    </div>
  </div>
);

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    return strength;
  };

  // Validate form fields
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!isLogin && !value) error = "Name is required";
        else if (!isLogin && value.length < 2) error = "Name must be at least 2 characters";
        else if (!isLogin && value.length > 50) error = "Name must be less than 50 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (!isLogin && value.length < 8) error = "Password must be at least 8 characters";
        else if (!isLogin && (!value.match(/[a-z]/) || !value.match(/[A-Z]/))) error = "Password must contain both uppercase and lowercase letters";
        else if (!isLogin && !value.match(/\d/)) error = "Password must contain at least one number";
        else if (!isLogin && !value.match(/[^a-zA-Z\d]/)) error = "Password must contain at least one special character";
        break;
      case "confirmPassword":
        if (!isLogin && !value) error = "Please confirm your password";
        else if (!isLogin && value !== formData.password) error = "Passwords do not match";
        break;
      case "terms":
        if (!isLogin && !acceptedTerms) error = "You must accept the terms and conditions";
        break;
    }
    return error;
  };

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Update password strength for password field
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  // Check for existing session and remembered email
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      
      if (rememberedEmail) {
        setFormData(prev => ({ ...prev, email: rememberedEmail }));
        setRememberMe(true);
      }
      
      if (token && user) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/verify`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          
          if (response.data.success) {
            navigate("/");
            return;
          }
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setPageLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
    });
    setPasswordStrength(0);
    setAcceptedTerms(false);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Only validate relevant fields based on form type
    const fieldsToValidate = isLogin 
      ? ['email', 'password']
      : ['name', 'email', 'password', 'confirmPassword'];

    // Validate required fields
    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    // Validate terms only for registration
    if (!isLogin) {
      const termsError = validateField("terms");
      newErrors.terms = termsError;
      if (termsError) isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted, isLogin:', isLogin);
    console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      const url = isLogin
        ? `${import.meta.env.VITE_BACKEND_URL}/api/users/login`
        : `${import.meta.env.VITE_BACKEND_URL}/api/users/register`;

      const dataToSend = isLogin
        ? { 
            email: formData.email.toLowerCase(),
            password: formData.password 
          }
        : {
            username: formData.name,
            email: formData.email.toLowerCase(),
            password: formData.password,
            role: 'user'
          };

      console.log('Sending data to:', url);
      console.log('Data being sent:', dataToSend);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await axios.post(url, dataToSend, config);
      console.log('Response received:', response.data);

      if (isLogin) {
        // Handle login response
        if (!response.data.success) {
          toast.error(response.data.message || "Login failed");
          return;
        }

        const { token, user } = response.data;
        console.log('Login response:', response.data);
        
        if (!token || !user) {
          console.error('Missing token or user data:', { token, user });
          toast.error("Invalid login response from server");
          return;
        }

        // Debug: Log user data before storage
        console.log('User data to be stored:', {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        });

        // Store authentication data
        localStorage.setItem("token", token);
        const userData = {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        };
        localStorage.setItem("user", JSON.stringify(userData));

        // Debug: Verify stored data
        const storedUserData = localStorage.getItem("user");
        console.log('Stored user data:', storedUserData);
        const parsedStoredData = JSON.parse(storedUserData);
        console.log('Parsed stored user data:', parsedStoredData);
        
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Show success message with user's name
        toast.success(
          `Welcome back, ${user.username}!`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
              background: "#10B981",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }
          }
        );

        // Navigate based on user role
        if (user.role === 'admin') {
          toast.info("Redirecting to admin dashboard...", {
            position: "top-right",
            autoClose: 1500,
            theme: "colored",
            style: {
              background: "#3B82F6",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }
          });
          setTimeout(() => navigate("/admin"), 1500);
        } else {
          toast.info("Redirecting to your profile...", {
            position: "top-right",
            autoClose: 1500,
            theme: "colored",
            style: {
              background: "#3B82F6",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }
          });
          setTimeout(() => navigate("/profile"), 1500);
        }
      } else {
        // Handle registration response
        if (response.data.success) {
          // Show success message
          toast.success(
            `Welcome to Plantify! Your account has been created successfully.`,
            {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          
          // Show loading state
          setIsLoading(true);
          
          // Show redirecting message
          toast.info("Redirecting to login...", {
            position: "top-center",
            autoClose: 1500,
          });
          
          // Switch to login form after a short delay
          setTimeout(() => {
            setIsLogin(true);
            setFormData({
              name: "",
              email: formData.email, // Keep the email
              password: "",
              confirmPassword: "",
            });
            setErrors({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              terms: "",
            });
            setPasswordStrength(0);
            setAcceptedTerms(false);
          }, 1500);
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Error details:", error);
      console.error("Error response:", error.response?.data);
      let errorMessage = "An error occurred";

      if (error.response) {
        const { status, data } = error.response;
        console.log('Error response:', { status, data });
        
        switch (status) {
          case 400:
            errorMessage = data.message || "Invalid data provided";
            break;
          case 401:
            errorMessage = "Incorrect email or password. Please try again.";
            break;
          case 409:
            errorMessage = "This email is already registered. Please login or use a different email.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
          default:
            errorMessage = data.message || "An error occurred";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingSpinner />;
  }

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Verify Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>
              <button
                onClick={() => setShowVerificationMessage(false)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin
              ? "Please sign in to your account"
              : "Get started with your free account"}
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="h-5 w-5 text-gray-400" />
                  ) : (
                    <IoEyeOutline className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              {!isLogin && formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          i < passwordStrength
                            ? passwordStrength === 1
                              ? 'bg-red-500'
                              : passwordStrength === 2
                              ? 'bg-yellow-500'
                              : passwordStrength === 3
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password strength: {passwordStrength === 0 ? 'None' : passwordStrength === 1 ? 'Weak' : passwordStrength === 2 ? 'Fair' : passwordStrength === 3 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <IoEyeOffOutline className="h-5 w-5 text-gray-400" />
                    ) : (
                      <IoEyeOutline className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {!isLogin && (
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{" "}
                  <Link to="/terms" className="font-medium text-emerald-600 hover:text-emerald-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-medium text-emerald-600 hover:text-emerald-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? "New to our platform?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center space-y-4">
              <button
                onClick={toggleForm}
                className="font-medium text-black hover:text-gray-800"
              >
                {isLogin ? "Create an account" : "Sign in to your account"}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <Link
                to="/planner/signup"
                className="block font-medium text-emerald-600 hover:text-emerald-700"
              >
                Sign up as a Gardener
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
