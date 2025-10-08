import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLeaf,
  FaDrumstickBite,
  FaStar,
  FaShoppingCart,
  FaCheck,
} from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeCartItem } from '../redux/userSlice';

function FoodCard({ data }) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.user);
  const existingCartItem = cartItems.find(i => i.id === data._id);
  const [isInCart, setIsInCart] = useState(!!existingCartItem);
  const [isAdding, setIsAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  // Sync with cart changes
  useEffect(() => {
    const itemInCart = cartItems.find(i => i.id === data._id);
    setIsInCart(!!itemInCart);
  }, [cartItems, data._id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" aria-hidden="true" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" aria-hidden="true" />
        )
      );
    }
    return stars;
  };

  const handleAddToCart = async () => {
    if (isAdding) return;

    setIsAdding(true);
    
    // Add to cart with quantity 1
    dispatch(addToCart({
      id: data._id,
      name: data.name,
      price: data.price,
      image: data.image,
      shop: data.shop,
      quantity: 1,
      foodType: data.foodType,
    }));

    // Show success animation
    setShowAdded(true);
    setTimeout(() => {
      setShowAdded(false);
      setIsAdding(false);
    }, 2000);
  };

  const handleRemoveFromCart = () => {
    dispatch(removeCartItem(data._id));
    setIsInCart(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  };

  const checkmarkVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    exit: { 
      scale: 0, 
      rotate: 180,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.article
      className="w-[280px] rounded-3xl border-2 border-[#ff4d2d]/20 bg-white shadow-lg overflow-hidden cursor-pointer group"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      aria-label={`${data.name} food item card`}
    >
      {/* Image Section with Overlay Effects */}
      <div className="relative w-full h-[200px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Food Type Badge */}
        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
          {data.foodType === 'veg' ? (
            <FaLeaf className="text-green-600 text-xl" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-xl" />
          )}
        </div>

        {/* Image with Gradient Overlay */}
        <motion.div
          className="relative w-full h-full"
          variants={imageVariants}
        >
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>

        
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5">
        <h2 className="font-bold text-gray-900 text-lg truncate mb-2 group-hover:text-[#ff4d2d] transition-colors duration-300" title={data.name}>
          {data.name}
        </h2>

        <div className="flex items-center gap-2 mb-3" aria-label={`Rated ${data.rating?.average || 0} out of 5 stars`}>
          {renderStars(data.rating?.average || 0)}
          <span className="text-sm text-gray-500 font-medium" aria-label={`${data.rating?.count || 0} reviews`}>
            ({data.rating?.count || 0})
          </span>
        </div>

        {/* Price and Main Add Button */}
        <footer className="flex items-center justify-between mt-auto">
          <span className="font-bold text-gray-900 text-xl" aria-live="polite">
            ₹{data.price}
          </span>

          <motion.button
            className={`relative px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all duration-300 flex items-center gap-2 ${
              isInCart 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-[#ff4d2d] hover:bg-[#e64323]'
            } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
            disabled={isAdding}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label={isInCart ? 'Remove from cart' : 'Add to cart'}
          >
            <AnimatePresence mode="wait">
              {showAdded || isInCart ? (
                <motion.span
                  key="check"
                  variants={checkmarkVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <FaCheck size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <FaShoppingCart size={16} />
                </motion.span>
              )}
            </AnimatePresence>
            {showAdded || isInCart ? 'Added' : 'Add to Cart'}
            
            {/* Ripple Effect */}
            {showAdded && (
              <motion.span
                className="absolute inset-0 rounded-full bg-white opacity-30"
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </motion.button>
        </footer>
      </div>
    </motion.article>
  );
}

export default FoodCard;