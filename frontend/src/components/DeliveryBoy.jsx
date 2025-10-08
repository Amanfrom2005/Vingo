import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import DeliveryBoyTracking from './DeliveryBoyTracking';
import { ClipLoader } from 'react-spinners';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FaMotorcycle, 
  FaMapMarkerAlt, 
  FaRupeeSign, 
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBoxOpen
} from "react-icons/fa";
import { 
  MdDeliveryDining, 
  MdLocationOn, 
  MdPayments,
  MdSchedule,
  MdTrendingUp
} from "react-icons/md";

function DeliveryBoy() {
  const { userData, socket } = useSelector(state => state.user);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [otp, setOtp] = useState('');
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Track delivery boy geo-location and emit updates to the socket server
  useEffect(() => {
    if (!socket || userData.role !== 'deliveryBoy') return;

    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setDeliveryBoyLocation({ lat: latitude, lon: longitude });
          socket.emit('updateLocation', {
            latitude,
            longitude,
            userId: userData._id,
          });
        },
        (error) => {
          console.error('Location tracking error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0);
  const totalDeliveries = todayDeliveries.reduce((sum, d) => sum + d.count, 0);

  // Enhanced delivery statistics
  const deliveryStats = [
    { name: 'Completed', value: totalDeliveries, color: '#10B981' },
    { name: 'Pending', value: availableAssignments?.length || 0, color: '#F59E0B' },
    { name: 'Current', value: currentOrder ? 1 : 0, color: '#3B82F6' }
  ];

  // Fetch available assignments
  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true });
      setAvailableAssignments(result.data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  // Fetch current order in progress
const getCurrentOrder = async () => {
  try {
    const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true });
    setCurrentOrder(result.data);
  } catch (error) {
    if (error.response?.status === 400) {
      // No active order found
      setCurrentOrder(null);
    } else {
      console.error('Failed to fetch current order:', error);
    }
  }
};

  // Accept an assignment by its ID
  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true });
      await getCurrentOrder();
      setAvailableAssignments(prev => prev?.filter(a => a.assignmentId !== assignmentId) || []);
    } catch (error) {
      console.error('Failed to accept order:', error);
      alert('Failed to accept order. Please try again.');
    }
  };

  // Listen for real-time new assignments from socket
  useEffect(() => {
    if (!socket) return;
    const handleNewAssignment = (data) => {
      setAvailableAssignments(prev => (prev ? [...prev, data] : [data]));
    };
    socket.on('newAssignment', handleNewAssignment);
    return () => {
      socket.off('newAssignment', handleNewAssignment);
    };
  }, [socket]);

  // Send delivery OTP to customer
  const sendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id },
        { withCredentials: true }
      );
      setShowOtpBox(true);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify delivery OTP entered by delivery boy
  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert('Please enter the OTP');
      return;
    }

    setMessage('');
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp },
        { withCredentials: true }
      );
      setMessage(result.data.message);
      setTimeout(() => {
        setCurrentOrder(null);
        setShowOtpBox(false);
        setOtp('');
        handleTodayDeliveries();
        getAssignments();
      }, 2000);
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      setMessage('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get today's deliveries for stats graph
  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true });
      setTodayDeliveries(result.data);
    } catch (error) {
      console.error('Failed to fetch today deliveries:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (userData) {
      getAssignments();
      getCurrentOrder();
      handleTodayDeliveries();
    }
  }, [userData]);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-orange-50 to-rose-50">
      <Nav />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header Section */}
        <motion.header 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Welcome, {userData.fullName}!
          </h1>
          <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
            <FaMotorcycle className="text-orange-500" />
            Ready to deliver amazing food experiences
          </p>
        </motion.header>

        {/* Stats Overview */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Earnings Card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-200"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaRupeeSign className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Today's Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalEarning}</p>
              </div>
            </div>
          </motion.div>

          {/* Deliveries Card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-200"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaShoppingBag className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{totalDeliveries}</p>
              </div>
            </div>
          </motion.div>

          {/* Location Card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-200"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaMapMarkerAlt className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Current Location</p>
                <p className="text-xs font-mono text-gray-900">
                  {deliveryBoyLocation ? 
                    `${deliveryBoyLocation.lat.toFixed(4)}, ${deliveryBoyLocation.lon.toFixed(4)}` : 
                    'Tracking...'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Statistics */}
            <motion.section
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MdTrendingUp className="text-orange-500" />
                Today's Delivery Analytics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Deliveries by Hour</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={todayDeliveries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="hour" 
                        tickFormatter={h => `${h}:00`}
                        fontSize={12}
                      />
                      <YAxis allowDecimals={false} fontSize={12} />
                      <Tooltip 
                        formatter={value => [value, 'Orders']}
                        labelFormatter={label => `${label}:00`}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#ff4d2d"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Delivery Status</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={deliveryStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {deliveryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.section>

            {/* Available Orders */}
            {!currentOrder && (
              <motion.section
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100"
                variants={itemVariants}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MdDeliveryDining className="text-orange-500" />
                  Available Delivery Orders
                </h2>

                <div className="space-y-4">
                  <AnimatePresence>
                    {availableAssignments?.length > 0 ? (
                      availableAssignments.map((assignment, index) => (
                        <motion.article
                          key={assignment.assignmentId || index}
                          className="border-2 border-orange-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all duration-200 bg-white"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <FaShoppingBag className="text-orange-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{assignment.shopName}</h3>
                                  <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-orange-500 text-xs" />
                                    {assignment.deliveryAddress.text.slice(0, 50)}...
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FaBoxOpen className="text-xs" />
                                  {assignment.items.length} items
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaRupeeSign className="text-xs" />
                                  {assignment.subtotal}
                                </span>
                              </div>
                            </div>
                            <motion.button
                              className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-200 shadow-md"
                              onClick={() => acceptOrder(assignment.assignmentId)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Accept Order
                            </motion.button>
                          </div>
                        </motion.article>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-gray-500"
                      >
                        <FaBoxOpen className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p>No available orders at the moment</p>
                        <p className="text-sm">New orders will appear here automatically</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}

            {/* Current Order */}
            {currentOrder && (
              <motion.section
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100"
                variants={itemVariants}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaMotorcycle className="text-green-500" />
                  Active Delivery
                </h2>

                {/* Order Details */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaUser className="text-green-500" />
                        Customer Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{currentOrder.user.fullName}</p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <FaPhone className="text-green-500" />
                          {currentOrder.user.mobile}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <FaEnvelope className="text-green-500" />
                          {currentOrder.user.email}
                        </p>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaShoppingBag className="text-green-500" />
                        Order Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{currentOrder.shopOrder.shop.name}</p>
                        <p className="text-gray-600">
                          {currentOrder.shopOrder.shopOrderItems.length} items
                        </p>
                        <p className="text-green-600 font-semibold flex items-center gap-1">
                          <FaRupeeSign />
                          {currentOrder.shopOrder.subtotal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-green-100">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-green-500" />
                      Delivery Address
                    </h4>
                    <p className="text-sm text-gray-700">{currentOrder.deliveryAddress.text}</p>
                  </div>
                </div>

                {/* Tracking Map */}
                <DeliveryBoyTracking
                  data={{
                    deliveryBoyLocation:
                      deliveryBoyLocation || {
                        lat: userData.location.coordinates[1],
                        lon: userData.location.coordinates[0],
                      },
                    customerLocation: {
                      lat: currentOrder.deliveryAddress.latitude,
                      lon: currentOrder.deliveryAddress.longitude,
                    },
                  }}
                />

                {/* OTP Section */}
                <AnimatePresence>
                  {!showOtpBox ? (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 mt-6"
                      onClick={sendOtp}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <ClipLoader size={20} color="white" />
                          <span>Sending OTP...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <FaCheckCircle />
                          <span>Mark As Delivered</span>
                        </div>
                      )}
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200"
                    >
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaClock className="text-orange-500" />
                        Delivery Verification
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Enter the OTP sent to <span className="font-semibold text-orange-600">{currentOrder.user.fullName}</span>
                      </p>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 mb-3"
                        placeholder="Enter 6-digit OTP"
                        onChange={(e) => setOtp(e.target.value)}
                        value={otp}
                        maxLength={6}
                      />
                      <AnimatePresence>
                        {message && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`text-center text-lg font-semibold mb-3 ${
                              message.includes('Invalid') ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <button
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-200"
                        onClick={verifyOtp}
                        disabled={loading || !otp.trim()}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <ClipLoader size={20} color="white" />
                            <span>Verifying...</span>
                          </div>
                        ) : (
                          'Verify & Complete Delivery'
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            )}
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            {/* Earnings Summary */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200"
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaRupeeSign className="text-green-500" />
                Earnings Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today's Earnings</span>
                  <span className="font-semibold text-green-600">₹{totalEarning}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Deliveries</span>
                  <span className="font-semibold text-blue-600">{totalDeliveries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rate per Delivery</span>
                  <span className="font-semibold text-orange-600">₹{ratePerDelivery}</span>
                </div>
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200"
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MdSchedule className="text-blue-500" />
                Performance
              </h3>
              <div className="space-y-3">
                {deliveryStats.map((stat, index) => (
                  <div key={stat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      <span className="text-gray-600">{stat.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200"
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={getAssignments}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
                >
                  Refresh Orders
                </button>
                <button
                  onClick={handleTodayDeliveries}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                >
                  Update Stats
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryBoy;