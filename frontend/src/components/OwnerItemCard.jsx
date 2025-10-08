import axios from 'axios';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPen, FaTrashAlt, FaLeaf, FaDrumstickBite, FaRupeeSign, FaTag } from "react-icons/fa";
import { MdFastfood, MdTimer } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function OwnerItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try { 
      const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true });
      dispatch(setMyShopData(result.data));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const getFoodTypeIcon = (foodType) => {
    return foodType === 'veg' ? 
      <FaLeaf className="text-green-600" /> : 
      <FaDrumstickBite className="text-red-600" />;
  };

  const getFoodTypeColor = (foodType) => {
    return foodType === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <>
      <motion.article
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-orange-100 hover:border-orange-200 transition-all duration-200 group"
        aria-label={`Food item: ${data.name}`}
        tabIndex={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        layout
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={data.image}
            alt={`Image of ${data.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          {/* Food Type Badge */}
          <div className="absolute top-3 left-3">
            <div className={`${getFoodTypeColor(data.foodType)} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-sm`}>
              {getFoodTypeIcon(data.foodType)}
              <span className="capitalize">{data.foodType}</span>
            </div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 truncate flex-1 mr-3" title={data.name}>
              {data.name}
            </h3>
            
            {/* Price */}
            <div className="flex items-center gap-1 text-2xl font-bold text-orange-600 whitespace-nowrap">
              <FaRupeeSign className="text-lg" />
              {data.price}
            </div>
          </div>

          {/* Description */}
          {data.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {data.description}
            </p>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Category */}
            <div className="flex items-center gap-2 text-gray-700">
              <FaTag className="text-orange-500 flex-shrink-0" />
              <span className="text-sm font-medium truncate" title={data.category}>
                {data.category}
              </span>
            </div>

            {/* Preparation Time */}
            {data.preparationTime && (
              <div className="flex items-center gap-2 text-gray-700">
                <MdTimer className="text-orange-500 flex-shrink-0" />
                <span className="text-sm font-medium">{data.preparationTime}</span>
              </div>
            )}
          </div>

          {/* Rating (if available) */}
          {data.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < Math.floor(data.rating.average) 
                        ? 'bg-yellow-400' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {data.rating.average} ({data.rating.count} reviews)
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <motion.button
              className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              onClick={() => navigate(`/edit-item/${data._id}`)}
              aria-label={`Edit item ${data.name}`}
              type="button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaPen size={14} />
              <span>Edit</span>
            </motion.button>

            <motion.button
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              onClick={openDeleteConfirm}
              aria-label={`Delete item ${data.name}`}
              type="button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ClipLoader size={14} color="#ef4444" />
              ) : (
                <>
                  <FaTrashAlt size={14} />
                  <span>Delete</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-rose-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </motion.article>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeDeleteConfirm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-orange-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTrashAlt className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Item?
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete <strong>"{data.name}"</strong>? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                  onClick={closeDeleteConfirm}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  type="button"
                >
                  {isDeleting ? (
                    <ClipLoader size={16} color="white" />
                  ) : (
                    <>
                      <FaTrashAlt size={14} />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default OwnerItemCard;