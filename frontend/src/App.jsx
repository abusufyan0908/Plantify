/* eslint-disable no-unused-vars */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './Context/AuthContext';
import ShopContextProvider from './Context/ShopContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import LoginForm from './pages/LoginForm';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import About from './pages/About';
import Chatbot from './pages/Chatbot';
import Planner from './pages/Planner';
import PlantIdent from './pages/Plant_Ident';
import PlaceOrder from './pages/PlaceOrder';
import UserDashboard from './pages/UserDashboard';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import Shope from './pages/Shope';
import ErrorBoundary from './components/ErrorBoundary';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ScrollToTop from './components/ScrollToTop';
import GardenerDetail from "./components/GardenerDetail";
import Chat from './components/Chat';
import PlannerSignup from './components/PlannerSignup';
import GardenerDashboard from './pages/GardenerDashboard';

export const backendUrl = "http://localhost:5000";

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ShopContextProvider>
          <div className="bg-gray-50 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <ScrollToTop />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shope" element={<Shope />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/plantid" element={<PlantIdent />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/gardener/:id" element={<GardenerDetail />} />
              <Route path="/chat/:gardenerId" element={<Chat />} />
              <Route path="/planner/signup" element={<PlannerSignup />} />
              <Route path="/gardener-dashboard" element={<GardenerDashboard />} />
            </Routes>
            <Footer />
            <ToastContainer />
          </div>
        </ShopContextProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;


