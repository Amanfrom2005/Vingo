import axios from 'axios';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdPhone, 
  MdLocationOn, 
  MdPayment, 
  MdDeliveryDining,
  MdPerson,
  MdSchedule
} from "react-icons/md";
import { 
  FaUser, 
  FaEnvelope, 
  FaRupeeSign, 
  FaMapMarkerAlt,
  FaShippingFast,
  FaUtensils,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';

function OwnerOrderCard({ data }) {
  const [availableBoys, setAvailableBoys] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();

  const handleUpdateStatus = async (orderId, shopId, status) => {
    setIsUpdating(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result.data.availableBoys || []);
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-orange-100 text-orange-800 border-orange-200',
      'out of delivery': 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      pending: <FaClock className="text-yellow-600" />,
      confirmed: <FaCheckCircle className="text-blue-600" />,
      preparing: <FaUtensils className="text-orange-600" />,
      'out of delivery': <FaShippingFast className="text-purple-600" />,
      delivered: <FaCheckCircle className="text-green-600" />,
      cancelled: <FaClock className="text-red-600" />
    };
    return statusIcons[status] || <FaClock className="text-gray-600" />;
  };

  const formatOrderId = (id) => {
    return `#${id.slice(-8).toUpperCase()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      y: -2,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.article
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 hover:border-orange-200 transition-all duration-200 overflow-hidden"
      aria-label={`Order details for ${data.user.fullName}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-50 to-rose-50 p-6 border-b border-orange-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center">
              <FaUser className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{data.user.fullName}</h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FaEnvelope className="text-orange-500" />
                  <span>{data.user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdPhone className="text-orange-500" />
                  <span>{data.user.mobile}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-gray-500">{formatOrderId(data._id)}</span>
            <span className="text-xs text-gray-400">{formatDate(data.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Payment and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payment Info */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MdPayment className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment</p>
              <p className={`font-semibold ${data.payment ? 'text-green-600' : 'text-orange-600'}`}>
                {data.paymentMethod === "online" 
                  ? (data.payment ? "Paid Online" : "Pending Online") 
                  : "Cash on Delivery"}
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border-2 ${getStatusColor(data.shopOrders.status)}`}>
            <div className="text-xl">
              {getStatusIcon(data.shopOrders.status)}
            </div>
            <div>
              <p className="text-sm font-medium">Current Status</p>
              <p className="font-bold capitalize">{data.shopOrders.status}</p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaMapMarkerAlt className="text-green-600 text-lg" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                Delivery Address
              </h3>
              <p className="text-gray-700 leading-relaxed">{data?.deliveryAddress?.text}</p>
              <p className="text-xs text-gray-500 mt-2">
                Coordinates: {data?.deliveryAddress?.latitude?.toFixed(4)}, {data?.deliveryAddress?.longitude?.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FaUtensils className="text-orange-500" />
              Ordered Items ({data.shopOrders.shopOrderItems.length})
            </h3>
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {isExpanded ? 'Show Less' : 'Show All'}
            </motion.button>
          </div>

          <div className={`grid gap-3 ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {(isExpanded ? data.shopOrders.shopOrderItems : data.shopOrders.shopOrderItems.slice(0, 2)).map((item, index) => (
              <motion.div
                key={item._id || index}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-orange-200 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={item.item.image}
                  alt={`Image of ${item.name}`}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>Qty: {item.quantity}</span>
                    <span>×</span>
                    <span className="flex items-center gap-1">
                      <FaRupeeSign className="text-xs" />
                      {item.price}
                    </span>
                  </div>
                  <p className="text-orange-600 font-semibold text-sm mt-1">
                    <FaRupeeSign className="inline text-xs" />
                    {item.quantity * item.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Update Section */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MdSchedule className="text-orange-500" />
            Update Order Status
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <select
              className="flex-1 px-4 py-3 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 appearance-none cursor-pointer font-medium"
              onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}
              aria-label="Change order status"
              defaultValue=""
              disabled={isUpdating}
            >
              <option value="" disabled className="text-gray-400">
                {isUpdating ? 'Updating...' : 'Update Status'}
              </option>
              <option value="pending" className="text-yellow-600">Pending</option>
              <option value="preparing" className="text-orange-600">Preparing</option>
              <option value="out of delivery" className="text-purple-600">Out for Delivery</option>
              <option value="delivered" className="text-green-600">Delivered</option>
            </select>

            {/* Order Total */}
            <div className="bg-white rounded-xl px-4 py-3 border border-orange-200 text-center sm:text-right">
              <p className="text-sm text-gray-600">Order Total</p>
              <p className="text-2xl font-bold text-orange-600 flex items-center justify-center sm:justify-end gap-1">
                <FaRupeeSign className="text-lg" />
                {data.shopOrders.subtotal}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Boys Info */}
        <AnimatePresence>
          {data.shopOrders.status === "out of delivery" && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-purple-50 rounded-xl p-4 border border-purple-200"
              aria-label="Delivery boys information"
            >
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MdDeliveryDining className="text-purple-500" />
                Delivery Information
              </h3>
              
              {data.shopOrders.assignedDeliveryBoy ? (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MdPerson className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {data.shopOrders.assignedDeliveryBoy.fullName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MdPhone className="text-purple-500" />
                      {data.shopOrders.assignedDeliveryBoy.mobile}
                    </p>
                  </div>
                </div>
              ) : availableBoys.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Available Delivery Boys:</p>
                  <div className="space-y-2">
                    {availableBoys.map((boy, index) => (
                      <div key={boy._id || index} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-purple-100">
                        <MdPerson className="text-purple-500" />
                        <span className="font-medium text-gray-900">{boy.fullName}</span>
                        <span className="text-sm text-gray-600">- {boy.mobile}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-gray-600">
                  <MdDeliveryDining className="text-3xl text-purple-400 mx-auto mb-2" />
                  <p>Waiting for delivery boy to accept the order</p>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export default OwnerOrderCard;