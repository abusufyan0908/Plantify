// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Add from "./pages/Add";
import Users from "./pages/Users";
import Order from "./pages/Order";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Gardener from "./pages/Gardener";

export const backendUrl = 'http://localhost:5000'; // or your actual backend URL
console.log('Backend URL:', backendUrl);
export const currency = 'Rs';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <div>
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
          <Routes>
            <Route path="/" element={<Home token={token} />} />
            <Route path="add" element={<Add token={token} />} />
            <Route path="orders" element={<Order token={token} />} />
            <Route path="users" element={<Users token={token} />} />
            <Route path="addgardener" element={<Gardener token={token} />} />

          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
