import axios from 'axios';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import {
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaReceipt,
  FaCreditCard,
  FaMoneyBillWave,
  FaShoppingBag,
  FaMotorcycle,
  FaCheckCircle,
  FaClock,
  FaUtensils,
  FaBox
} from 'react-icons/fa';

function UserOrderCard({ data }) {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({});
  const [expandedShop, setExpandedShop] = useState(null);

  // Format ISO date string to `dd MMM yyyy, hh:mm a`
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusConfig = {
      pending: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: FaClock, label: 'Pending' },
      confirmed: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: FaCheckCircle, label: 'Confirmed' },
      preparing: { color: 'text-orange-600 bg-orange-50 border-orange-200', icon: FaUtensils, label: 'Preparing' },
      'out-for-delivery': { color: 'text-purple-600 bg-purple-50 border-purple-200', icon: FaMotorcycle, label: 'Out for Delivery' },
      delivered: { color: 'text-green-600 bg-green-50 border-green-200', icon: FaBox, label: 'Delivered' },
      cancelled: { color: 'text-red-600 bg-red-50 border-red-200', icon: FaClock, label: 'Cancelled' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  // Handle rating submission
  const handleRating = async (itemId, rating) => {
    try {
      await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true }
      );
      setSelectedRating((prev) => ({
        ...prev,
        [itemId]: rating,
      }));
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const toggleShopExpand = (shopId) => {
    setExpandedShop(expandedShop === shopId ? null : shopId);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -2,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.article
      className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      aria-label={`Order ${data._id.slice(-6)}`}
    >
      {/* Order Header */}
      <header className="bg-gradient-to-r from-orange-50 to-rose-50 p-6 border-b border-orange-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <FaReceipt className="text-2xl text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Order #{data._id.slice(-6).toUpperCase()}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <FaCalendarAlt className="text-orange-500" />
                <span className="text-sm">{formatDate(data.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Payment Status */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm">
              {data.paymentMethod === "cod" ? (
                <>
                  <FaMoneyBillWave className="text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                </>
              ) : (
                <>
                  <FaCreditCard className={data.payment ? 'text-green-500' : 'text-yellow-500'} />
                  <span className="text-sm font-medium">
                    {data.payment ? 'Payment Completed' : 'Payment Pending'}
                  </span>
                </>
              )}
            </div>

            {/* Total Amount */}
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
              <span className="text-lg font-bold text-gray-900">
                ₹{data.totalAmount}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Shop Orders */}
      <div className="p-6 space-y-4">
        {data.shopOrders.map((shopOrder, sIndex) => {
          const statusInfo = getStatusInfo(shopOrder.status);
          const StatusIcon = statusInfo.icon;
          const isExpanded = expandedShop === shopOrder._id;

          return (
            <motion.section
              key={shopOrder._id || sIndex}
              className="border-2 border-orange-100 rounded-xl bg-white overflow-hidden"
              initial={false}
              animate={{ height: 'auto' }}
            >
              {/* Shop Header */}
              <button
                onClick={() => toggleShopExpand(shopOrder._id)}
                className="w-full p-4 text-left hover:bg-orange-50 transition-colors duration-200"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FaShoppingBag className="text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {shopOrder.shop.name}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-orange-400" />
                        {shopOrder.shop.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusInfo.color}`}>
                      <StatusIcon className="text-sm" />
                      <span className="text-sm font-medium capitalize">{statusInfo.label}</span>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Subtotal</span>
                      <p className="font-semibold text-gray-900">₹{shopOrder.subtotal}</p>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expandable Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-orange-100"
                  >
                    <div className="p-4">
                      {/* Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {shopOrder.shopOrderItems.map((item, iIndex) => (
                          <motion.article
                            key={item.item._id || iIndex}
                            className="border border-gray-200 rounded-xl p-3 bg-white hover:shadow-md transition-shadow duration-200"
                            whileHover={{ scale: 1.02 }}
                            aria-label={`${item.name}, quantity ${item.quantity}, price ${item.price} rupees`}
                          >
                            <div className="flex gap-3">
                              <img
                                src={item.item.image}
                                alt={`Image of ${item.name}`}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-900 truncate" title={item.name}>
                                  {item.name}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  Qty: {item.quantity} × ₹{item.price}
                                </p>
                                <p className="text-sm font-semibold text-orange-600 mt-1">
                                  ₹{item.quantity * item.price}
                                </p>

                                {/* Rating Section */}
                                {shopOrder.status === "delivered" && (
                                  <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-2">Rate this item:</p>
                                    <div className="flex gap-1" role="radiogroup" aria-label={`Rate the item ${item.name}`}>
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                          key={star}
                                          className={`text-lg focus:outline-none transition-transform ${
                                            selectedRating[item.item._id] >= star 
                                              ? 'text-yellow-400 scale-110' 
                                              : 'text-gray-300 hover:text-yellow-300'
                                          }`}
                                          onClick={() => handleRating(item.item._id, star)}
                                          whileHover={{ scale: 1.2 }}
                                          whileTap={{ scale: 0.9 }}
                                          aria-pressed={selectedRating[item.item._id] === star}
                                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                          type="button"
                                        >
                                          {selectedRating[item.item._id] >= star ? <FaStar /> : <FaRegStar />}
                                        </motion.button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.article>
                        ))}
                      </div>

                      {/* Shop Order Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          {shopOrder.shopOrderItems.length} item{shopOrder.shopOrderItems.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">Subtotal</span>
                          <p className="text-lg font-bold text-gray-900">₹{shopOrder.subtotal}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </div>

      {/* Footer with total and tracking button */}
      <footer className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-sm text-gray-500">Order Total</span>
            <p className="text-2xl font-bold text-gray-900">₹{data.totalAmount}</p>
          </div>
          
          <div className="flex gap-3 justify-center sm:justify-end">
            <motion.button
              className="px-6 py-3 bg-white border border-orange-500 text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/order-details/${data._id}`)}
              aria-label="View order details"
              type="button"
            >
              View Details
            </motion.button>
            
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/track-order/${data._id}`)}
              aria-label="Track this order"
              type="button"
            >
              Track Order
            </motion.button>
          </div>
        </div>
      </footer>
    </motion.article>
  );
}

export default UserOrderCard;