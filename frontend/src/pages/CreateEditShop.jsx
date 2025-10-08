import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils, FaStore, FaMapMarkerAlt, FaCity, FaLandmark, FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function CreateEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector(state => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(state => state.user);

  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(myShopData?.address || currentAddress || "");
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Sync with Redux store updates
    setName(myShopData?.name || "");
    setAddress(myShopData?.address || currentAddress || "");
    setCity(myShopData?.city || currentCity || "");
    setState(myShopData?.state || currentState || "");
    setFrontendImage(myShopData?.image || null);
    setBackendImage(null);
  }, [myShopData, currentCity, currentState, currentAddress]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
      } else {
        alert('Please select a valid image file.');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    } else {
      alert('Please drop a valid image file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Enhanced validation
    if (!name.trim()) {
      alert("Please enter your shop name.");
      return;
    }
    if (!city.trim()) {
      alert("Please enter your city.");
      return;
    }
    if (!state.trim()) {
      alert("Please enter your state.");
      return;
    }
    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("city", city.trim());
      formData.append("state", state.trim());
      formData.append("address", address.trim());
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(`${serverUrl}/api/shop/create-edit`, formData, { withCredentials: true });
      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/owner-dashboard");
    } catch (error) {
      console.error("Error saving shop:", error);
      setLoading(false);
      alert("Failed to save shop details. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center p-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
      </div>

      <motion.button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 group"
        aria-label="Go back"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <IoIosArrowRoundBack size={28} className="text-orange-600 group-hover:text-orange-700 transition-colors" />
      </motion.button>

      <motion.div 
        className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-orange-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-8 text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaStore className="text-white text-3xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {myShopData ? "Edit Your Restaurant" : "Create Your Restaurant"}
          </h1>
          <p className="text-orange-100 text-lg">
            {myShopData ? "Update your restaurant details" : "Join our platform and start serving amazing food"}
          </p>
        </div>

        <motion.form 
          className="p-8 space-y-6"
          onSubmit={handleSubmit}
          noValidate
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Shop Name */}
          <motion.div variants={itemVariants}>
            <label htmlFor="shopName" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUtensils className="text-orange-500" />
              Restaurant Name
            </label>
            <input
              id="shopName"
              type="text"
              placeholder="Enter your restaurant name"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-required="true"
              autoComplete="off"
            />
          </motion.div>

          {/* Image Upload */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUpload className="text-orange-500" />
              Restaurant Image
            </label>
            
            <div
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer ${
                isDragging 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('shopImage').click()}
            >
              <input
                id="shopImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
                aria-describedby="shopImageDesc"
              />
              
              <AnimatePresence mode="wait">
                {frontendImage ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <img
                      src={frontendImage}
                      alt={`${name || 'Restaurant'} preview`}
                      className="w-full h-48 object-cover rounded-xl border-2 border-orange-200 mx-auto"
                      loading="lazy"
                    />
                    <p className="text-sm text-gray-600">
                      Click or drag to change image
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div className="w-16 h-16 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center">
                      <FaUpload className="text-orange-500 text-2xl" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Upload Restaurant Image</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Location Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaCity className="text-orange-500" />
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="Enter city"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder-gray-400"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                aria-required="true"
                autoComplete="address-level2"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaLandmark className="text-orange-500" />
                State
              </label>
              <input
                id="state"
                type="text"
                placeholder="Enter state"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder-gray-400"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                aria-required="true"
                autoComplete="address-level1"
              />
            </div>
          </motion.div>

          {/* Address */}
          <motion.div variants={itemVariants}>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-500" />
              Full Address
            </label>
            <textarea
              id="address"
              placeholder="Enter your complete restaurant address"
              rows="3"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder-gray-400 resize-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              aria-required="true"
              autoComplete="street-address"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            aria-busy={loading}
            variants={buttonVariants}
            whileHover={!loading ? "hover" : {}}
            whileTap={!loading ? "tap" : {}}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <ClipLoader size={20} color="white" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaStore className="text-lg" />
                <span>{myShopData ? 'Update Restaurant' : 'Create Restaurant'}</span>
              </div>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default CreateEditShop;