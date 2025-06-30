// eslint-disable-next-line no-unused-vars
import React, { useState } from "react"; // Import useState
import axios from "axios";
import { backendUrl } from "../App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
    setError(null); // Reset error message

    try {
      const response = await axios.post(backendUrl + "/api/users/admin/login", {
        email,
        password,
      });

      // If login is successful, store the token (if returned)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/"; // Redirect after successful login
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-lg p-6">
        {/* Logo/Heading */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Admin Login
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-500 text-center">{error}</div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmitHandler}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-600 transition-all duration-300"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
