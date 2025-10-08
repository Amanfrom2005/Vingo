import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStore, FaStar } from 'react-icons/fa';

// Enhanced CategoryCard Component
function CategoryCard({ name, image, onClick, rating, deliveryTime }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="relative w-[140px] h-[140px] md:w-[200px] md:h-[200px] rounded-3xl shrink-0 overflow-hidden group focus:outline-none focus:ring-3 focus:ring-[#ff4d2d] focus:ring-offset-2"
      aria-label={`Shop ${name}`}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-900/60 rounded-3xl" />
      
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
        loading="lazy"
        decoding="async"
      />

      {/* Shine Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-3xl" />

      {/* Shop Info */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
        {/* Rating Badge */}
        {rating && (
          <div className="flex items-center gap-1 mb-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-xs font-semibold">{rating}</span>
          </div>
        )}

        {/* Shop Name */}
        <h3 className="font-bold text-lg leading-tight text-left mb-2 truncate">
          {name}
        </h3>

        {/* Delivery Info */}
        {deliveryTime && (
          <div className="flex items-center justify-between text-xs opacity-90">
            <span className="flex items-center gap-1 bg-[#ff4d2d] rounded-full px-2 py-1">
              <FaStore size={10} />
              <span>Shop</span>
            </span>
            <span>{deliveryTime} min</span>
          </div>
        )}

        {/* Hover Action Indicator */}
        <div className="absolute right-3 top-3 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-[#ff4d2d] rounded-full p-2 shadow-lg">
            <FaStore className="text-white text-sm" />
          </div>
        </div>
      </div>

      {/* Pulse Animation for New/Featured Shops */}
      <div className="absolute -top-1 -right-1">
        <div className="relative">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
        </div>
      </div>
    </motion.button>
  );
}

export default CategoryCard;