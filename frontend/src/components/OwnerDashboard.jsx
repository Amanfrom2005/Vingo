import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import { FaUtensils, FaPen, FaPlus, FaStore, FaMapMarkerAlt, FaStar, FaClock } from "react-icons/fa";
import { MdDeliveryDining, MdFastfood, MdOutlineMenuBook } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './OwnerItemCard';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner);
  const navigate = useNavigate();

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const stats = myShopData ? [
    { icon: <MdFastfood />, label: 'Total Items', value: myShopData.items?.length || 0, color: 'text-blue-600' },
    { icon: <FaStar />, label: 'Average Rating', value: '4.5', color: 'text-yellow-600' },
    { icon: <FaClock />, label: 'Prep Time', value: '20-30 min', color: 'text-green-600' },
    { icon: <MdDeliveryDining />, label: 'Delivery', value: 'Available', color: 'text-purple-600' }
  ] : [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      <Nav />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <AnimatePresence mode="wait">
          {!myShopData ? (
            <motion.section
              key="no-shop"
              aria-label="Add your restaurant"
              className="flex justify-center items-center p-4 sm:p-6 w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-100 shadow-2xl hover:shadow-3xl transition-all duration-300 w-full max-w-md text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
                  <FaStore className="text-4xl text-orange-500" aria-hidden="true" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-3">
                  Start Your Restaurant Journey
                </h2>
                <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                  Join thousands of successful restaurants on our platform. Reach hungry customers, grow your business, and serve amazing food.
                </p>
                <motion.button
                  className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:from-orange-600 hover:to-rose-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2"
                  onClick={() => navigate("/create-edit-shop")}
                  aria-label="Get started to add restaurant"
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaPlus className="text-lg" />
                    <span>Get Started</span>
                  </div>
                </motion.button>
              </motion.div>
            </motion.section>
          ) : (
            <motion.section
              key="has-shop"
              className="w-full flex flex-col items-center gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Header Section */}
              <motion.header className="text-center" variants={itemVariants}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-4">
                  Welcome to {myShopData.name}
                </h1>
                <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
                  <FaUtensils className="text-orange-500" />
                  Manage your restaurant and serve amazing food
                </p>
              </motion.header>

              {/* Stats Overview */}
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl"
                variants={itemVariants}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-200 text-center"
                    whileHover={{ y: -2, scale: 1.02 }}
                  >
                    <div className={`text-2xl mb-2 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Shop Details Card */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-orange-100 shadow-2xl hover:shadow-3xl transition-all duration-300 w-full max-w-4xl relative group"
                aria-label={`Restaurant details for ${myShopData.name}`}
                variants={cardVariants}
                whileHover="hover"
              >
                {/* Edit Button */}
                <motion.button
                  onClick={() => navigate("/create-edit-shop")}
                  aria-label="Edit shop details"
                  className="absolute top-6 right-6 bg-gradient-to-r from-orange-500 to-rose-500 text-white p-3 rounded-2xl shadow-lg hover:from-orange-600 hover:to-rose-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 z-10"
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaPen size={20} />
                </motion.button>

                {/* Shop Image */}
                <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
                  <img
                    src={myShopData.image}
                    alt={`Image of ${myShopData.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Shop Info */}
                <div className="p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {myShopData.name}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                        <span>{myShopData.city}, {myShopData.state}</span>
                      </div>
                      <p className="text-gray-500 text-sm lg:text-base">
                        {myShopData.address}
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {myShopData.description && (
                    <p className="text-gray-600 leading-relaxed border-t border-gray-200 pt-4 mt-4">
                      {myShopData.description}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Items Section */}
              <motion.section
                className="w-full max-w-7xl"
                variants={itemVariants}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <MdOutlineMenuBook className="text-orange-500" />
                    Menu Items
                    <span className="text-lg text-gray-500 font-normal">
                      ({myShopData.items.length} items)
                    </span>
                  </h2>
                  <motion.button
                    onClick={() => navigate("/add-item")}
                    className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:from-orange-600 hover:to-rose-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 flex items-center gap-2 w-full sm:w-auto justify-center"
                    aria-label="Add new food item"
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlus />
                    <span>Add Food Item</span>
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {myShopData.items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-orange-100 shadow-lg text-center"
                    >
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
                        <MdFastfood className="text-4xl text-orange-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Your Menu is Empty
                      </h3>
                      <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                        Start by adding your delicious creations to attract more customers and grow your business.
                      </p>
                      <motion.button
                        className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:from-orange-600 hover:to-rose-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 text-lg"
                        onClick={() => navigate("/add-item")}
                        aria-label="Add new food item"
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add Your First Menu Item
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {myShopData.items.map((item, index) => (
                        <motion.div
                          key={item._id || index}
                          variants={itemVariants}
                          layout
                          className="h-full"
                        >
                          <OwnerItemCard data={item} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OwnerDashboard;