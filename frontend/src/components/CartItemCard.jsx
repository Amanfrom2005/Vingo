import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMinus, FaPlus, FaLeaf, FaDrumstickBite } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';

function CartItemCard({ data }) {
  const dispatch = useDispatch();

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeCartItem(id));
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    },
    hover: {
      y: -2,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const trashVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.2, rotate: 10 },
    tap: { scale: 0.9, rotate: -5 }
  };

  return (
    <motion.article
      className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-orange-100 hover:border-orange-200 transition-colors duration-200"
      aria-label={`${data.name} cart item`}
      role="region"
      tabIndex={0}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      layout
    >
      {/* Left Section - Image and Details */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Image with Food Type Badge */}
        <div className="relative flex-shrink-0">
          <img
            src={data.image}
            alt={data.name}
            className="w-24 h-24 object-cover rounded-xl border-2 border-orange-100 shadow-sm"
            loading="lazy"
            decoding="async"
          />
          {/* Food Type Indicator */}
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md border">
            {data.foodType === 'veg' ? (
              <FaLeaf className="text-green-600 text-xs" aria-label="Vegetarian" />
            ) : (
              <FaDrumstickBite className="text-red-600 text-xs" aria-label="Non-vegetarian" />
            )}
          </div>
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <h2 
            className="font-semibold text-gray-900 text-lg truncate mb-1" 
            title={data.name}
          >
            {data.name}
          </h2>
          
          {/* Shop Name */}
          {data.shop && (
            <p className="text-sm text-gray-500 mb-2 truncate">
              From: {data.shop.name}
            </p>
          )}
          
          {/* Price Breakdown */}
          <div className="flex items-center gap-3 mb-2">
            <p className="text-sm text-gray-600" aria-label={`Unit price ₹${data.price}`}>
              ₹{data.price} each
            </p>
            <span className="text-gray-300">•</span>
            <p className="text-sm text-gray-600" aria-label={`Quantity: ${data.quantity}`}>
              {data.quantity} {data.quantity === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Total Price */}
          <p 
            className="text-xl font-bold text-orange-600" 
            aria-live="polite" 
            aria-atomic="true"
          >
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-4" role="group" aria-label={`Quantity controls for ${data.name}`}>
        {/* Quantity Controls */}
        <div className="flex items-center gap-3 bg-orange-50 rounded-2xl p-2 border border-orange-200">
          <motion.button
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${
              data.quantity <= 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-orange-600 hover:bg-orange-100 shadow-sm'
            }`}
            onClick={() => handleDecrease(data.id, data.quantity)}
            aria-label={`Decrease quantity of ${data.name}`}
            disabled={data.quantity <= 1}
            type="button"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaMinus size={12} aria-hidden="true" />
          </motion.button>
          
          <span 
            className="min-w-[2rem] text-center font-semibold text-gray-900 text-lg" 
            aria-live="polite" 
            aria-atomic="true" 
            aria-label={`Current quantity: ${data.quantity}`}
          >
            {data.quantity}
          </span>
          
          <motion.button
            className="w-8 h-8 flex items-center justify-center bg-white text-orange-600 rounded-full hover:bg-orange-100 shadow-sm transition-colors duration-200"
            onClick={() => handleIncrease(data.id, data.quantity)}
            aria-label={`Increase quantity of ${data.name}`}
            type="button"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaPlus size={12} aria-hidden="true" />
          </motion.button>
        </div>

        {/* Remove Button */}
        <motion.button
          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-200 transition-colors duration-200 group"
          onClick={() => handleRemove(data.id)}
          aria-label={`Remove ${data.name} from cart`}
          type="button"
          variants={trashVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <MdDeleteOutline 
            size={20} 
            aria-hidden="true" 
            className="group-hover:text-red-700 transition-colors" 
          />
        </motion.button>
      </div>

      {/* Progress Bar for Quantity (Visual Enhancement) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-rose-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ 
             width: `${Math.min((data.quantity / 10) * 100, 100)}%`,
             maxWidth: '100%'
           }} 
      />
    </motion.article>
  );
}

export default CartItemCard;