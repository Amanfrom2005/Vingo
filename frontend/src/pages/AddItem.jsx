import axios from 'axios';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUtensils, 
  FaUpload, 
  FaRupeeSign, 
  FaTag, 
  FaLeaf, 
  FaDrumstickBite,
  FaStore
} from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';
import { serverUrl } from '../App';

function AddItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector(state => state.owner);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState('');
  const [foodType, setFoodType] = useState('veg');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    "Snacks", "Main Course", "Desserts", "Pizza", "Burgers", 
    "Sandwiches", "South Indian", "North Indian", "Chinese", 
    "Fast Food", "Beverages", "Starters", "Biryani", "Others"
  ];

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
    if (!name.trim()) {
      alert("Please enter the food name.");
      return;
    }
    if (!category) {
      alert("Please select a category.");
      return;
    }
    if (!price || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);
      formData.append("description", description.trim());
      if (preparationTime) formData.append("preparationTime", preparationTime);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(`${serverUrl}/api/item/add-item`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/owner-dashboard");
    } catch (error) {
      console.error("Error adding item:", error);
      setLoading(false);
      alert("Failed to add item. Please try again.");
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
        className="absolute top-6 left-6 z-10 bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 group"
        onClick={() => navigate("/")}
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
            <FaUtensils className="text-white text-3xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Add New Menu Item
          </h1>
          <p className="text-orange-100 text-lg">
            Create a delicious addition to your restaurant menu
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
          {/* Food Name */}
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUtensils className="text-orange-500" />
              Food Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter delicious food name"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder-gray-400"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              autoComplete="off"
              aria-required="true"
            />
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaStore className="text-orange-500" />
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Describe your delicious food item..."
              rows="3"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder-gray-400 resize-none"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              autoComplete="off"
            />
          </motion.div>

          {/* Image Upload */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUpload className="text-orange-500" />
              Food Image
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
              onClick={() => document.getElementById('foodImage').click()}
            >
              <input
                id="foodImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
                aria-describedby="foodImage-desc"
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
                      alt="Preview of uploaded food"
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
                      <p className="text-gray-700 font-medium">Upload Food Image</p>
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

          {/* Price and Preparation Time Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaRupeeSign className="text-orange-500" />
                Price
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder-gray-400"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
                aria-required="true"
                inputMode="decimal"
              />
            </div>

            {/* Preparation Time */}
            <div>
              <label htmlFor="preparationTime" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUtensils className="text-orange-500" />
                Preparation Time (Optional)
              </label>
              <input
                id="preparationTime"
                type="text"
                placeholder="e.g., 15-20 min"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder-gray-400"
                onChange={(e) => setPreparationTime(e.target.value)}
                value={preparationTime}
                autoComplete="off"
              />
            </div>
          </motion.div>

          {/* Category and Food Type Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaTag className="text-orange-500" />
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 appearance-none cursor-pointer"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                required
                aria-required="true"
              >
                <option value="" disabled className="text-gray-400">
                  Select Category
                </option>
                {categories.map((cate, index) => (
                  <option value={cate} key={index} className="text-gray-900">
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            {/* Food Type */}
            <div>
              <label htmlFor="foodType" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                {foodType === 'veg' ? (
                  <FaLeaf className="text-green-600" />
                ) : (
                  <FaDrumstickBite className="text-red-600" />
                )}
                Food Type
              </label>
              <select
                id="foodType"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 appearance-none cursor-pointer"
                onChange={(e) => setFoodType(e.target.value)}
                value={foodType}
              >
                <option value="veg" className="text-green-600">Vegetarian</option>
                <option value="non veg" className="text-red-600">Non-Vegetarian</option>
              </select>
            </div>
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
                <span>Adding Item...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaUtensils className="text-lg" />
                <span>Add to Menu</span>
              </div>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default AddItem;