import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaShoppingBag, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { MdDeliveryDining, MdDiscount } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { clearCart } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../App';

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const discount = totalAmount > 500 ? 40 : 0;
  const finalAmount = totalAmount + deliveryFee;

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await axios.delete(`${serverUrl}/api/user/cart-clear`, {
          withCredentials: true,
        });
        dispatch(clearCart());
      } catch (error) {
        console.error('Failed to clear cart:', error);
        alert('Failed to clear cart. Please try again.');
      }
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

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50" aria-label="Shopping cart page">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Header */}
          <motion.header 
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Go back to home"
              className="bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoIosArrowRoundBack size={28} className="text-orange-600 group-hover:text-orange-700 transition-colors" />
            </motion.button>
            
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                Your Cart
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <FaShoppingBag className="text-orange-500" />
                {cartItems?.length || 0} item{cartItems?.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>

            {cartItems?.length > 0 && (
              <motion.button
                type="button"
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Clear entire cart"
              >
                <FaTrash size={14} />
                <span>Clear Cart</span>
              </motion.button>
            )}
          </motion.header>

          <AnimatePresence mode="wait">
            {cartItems?.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                role="alert"
                aria-live="polite"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
                    <FaShoppingBag className="text-4xl text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-3">
                    Your Cart is Empty
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Looks like you haven't added any items to your cart yet. Start exploring our delicious menu!
                  </p>
                  <motion.button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Start shopping"
                  >
                    Start Shopping
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <motion.section 
                  className="lg:col-span-2 space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  aria-label="Cart items list"
                >
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
                    >
                      <CartItemCard data={item} />
                    </motion.div>
                  ))}
                </motion.section>

                {/* Order Summary */}
                <motion.aside
                  className="lg:col-span-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden sticky top-24">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-6">
                      <h2 className="text-xl font-bold text-white text-center">
                        Order Summary
                      </h2>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Items Count */}
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Items ({cartItems.length})</span>
                        <span className="font-semibold">₹{totalAmount}</span>
                      </div>

                      {/* Delivery Fee */}
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-2">
                          <MdDeliveryDining className="text-orange-500" />
                          Delivery Fee
                        </span>
                        <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                          {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                        </span>
                      </div>

                      {/* Discount */}
                      {discount > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span className="flex items-center gap-2">
                            <MdDiscount className="text-green-500" />
                            Delivery Discount
                          </span>
                          <span className="font-semibold">-₹{discount}</span>
                        </div>
                      )}

                      {/* Total Amount */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                          <span>Total Amount</span>
                          <span className="text-2xl text-orange-600">₹{finalAmount}</span>
                        </div>
                      </div>

                      {/* Savings Info */}
                      {discount > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                          <p className="text-sm text-green-700 text-center font-medium">
                            🎉 You saved ₹{discount} on delivery!
                          </p>
                        </div>
                      )}

                      {/* Checkout Button */}
                      <motion.button
                        type="button"
                        onClick={() => navigate("/checkout")}
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="Proceed to checkout"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <MdDeliveryDining className="text-xl" />
                          <span>Proceed to Checkout</span>
                        </div>
                        <div className="text-sm font-normal opacity-90">
                          ₹{finalAmount} • {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                        </div>
                      </motion.button>

                      {/* Continue Shopping */}
                      <motion.button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-full bg-white border-2 border-orange-500 text-orange-500 py-3 rounded-2xl font-semibold hover:bg-orange-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="Continue shopping"
                      >
                        Continue Shopping
                      </motion.button>
                    </div>

                    {/* Security Badge */}
                    <div className="bg-gray-50 border-t border-gray-200 p-4">
                      <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Secure checkout • SSL encrypted</span>
                      </div>
                    </div>
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CartPage;