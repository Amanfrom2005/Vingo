import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoIosArrowBack, 
  IoIosRestaurant, 
  IoIosCart, 
  IoIosTime, 
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoIosList,
  IoIosArrowDown,
  IoIosArrowUp
} from "react-icons/io";
import { 
  FaMotorcycle, 
  FaUtensils, 
  FaBoxOpen,
  FaFilter,
  FaSearch,
  FaChartBar,
  FaSortAmountDown
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

function MyOrders() {
  const { userData, myOrders, socket } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const orderStatusFilters = [
    { key: 'all', label: 'All Orders', icon: <IoIosList />, color: 'text-gray-600', bgColor: 'bg-gray-100' },
    { key: 'pending', label: 'Pending', icon: <IoIosTime />, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { key: 'confirmed', label: 'Confirmed', icon: <IoIosCheckmarkCircle />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { key: 'preparing', label: 'Preparing', icon: <FaUtensils />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { key: 'out-for-delivery', label: 'Out for Delivery', icon: <FaMotorcycle />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { key: 'delivered', label: 'Delivered', icon: <IoIosCheckmarkCircle />, color: 'text-green-600', bgColor: 'bg-green-100' },
    { key: 'cancelled', label: 'Cancelled', icon: <IoIosCloseCircle />, color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  // Safe function to check if shopOrders has a specific status
  const hasOrderStatus = (order, status) => {
    if (!order.shopOrders) return false;
    
    // Handle both array and object formats
    if (Array.isArray(order.shopOrders)) {
      return order.shopOrders.some(shopOrder => shopOrder.status === status);
    } else if (typeof order.shopOrders === 'object') {
      return order.shopOrders.status === status;
    }
    
    return false;
  };

  // Filter and sort orders
  const filteredOrders = React.useMemo(() => {
    if (!myOrders || !Array.isArray(myOrders)) return [];

    let filtered = myOrders.filter(order => {
      // Status filter
      const statusMatch = activeFilter === 'all' || hasOrderStatus(order, activeFilter);
      
      // Search filter
      const searchMatch = searchTerm === '' || 
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shopOrders && 
          (Array.isArray(order.shopOrders) 
            ? order.shopOrders.some(shopOrder => 
                shopOrder.shop?.name?.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : order.shopOrders.shop?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      
      return statusMatch && searchMatch;
    });

    // Sort orders
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      
      switch (sortBy) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'total-high':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case 'total-low':
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  }, [myOrders, activeFilter, searchTerm, sortBy]);

  const getOrderStats = () => {
    if (!myOrders || !Array.isArray(myOrders)) return { total: 0, pending: 0, preparing: 0, delivered: 0, cancelled: 0 };

    const stats = {
      total: myOrders.length,
      pending: myOrders.filter(order => hasOrderStatus(order, 'pending')).length,
      preparing: myOrders.filter(order => hasOrderStatus(order, 'preparing')).length,
      delivered: myOrders.filter(order => hasOrderStatus(order, 'delivered')).length,
      cancelled: myOrders.filter(order => hasOrderStatus(order, 'cancelled')).length,
    };
    return stats;
  };

  const stats = getOrderStats();

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data) => {
      if (data.shopOrders?.owner?._id === userData?._id) {
        dispatch(setMyOrders([data, ...(myOrders || [])]));
      }
    };

    const handleUpdateStatus = ({ orderId, shopId, status, userId }) => {
      if (userId === userData?._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
      }
    };

    socket.on('newOrder', handleNewOrder);
    socket.on('update-status', handleUpdateStatus);

    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.off('update-status', handleUpdateStatus);
    };
  }, [socket, userData, myOrders, dispatch]);

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

  const clearFilters = () => {
    setActiveFilter('all');
    setSearchTerm('');
    setSortBy('newest');
  };

  const hasActiveFilters = activeFilter !== 'all' || searchTerm !== '' || sortBy !== 'newest';

  // Calculate order statistics for visualization
  const orderStatsData = [
    { name: 'Delivered', value: stats.delivered, color: '#10B981' },
    { name: 'Preparing', value: stats.preparing, color: '#F59E0B' },
    { name: 'Pending', value: stats.pending, color: '#3B82F6' },
    { name: 'Cancelled', value: stats.cancelled, color: '#EF4444' },
  ].filter(item => item.value > 0);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50" aria-label="My Orders Page">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Header Section */}
          <motion.header 
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                onClick={() => navigate('/')}
                aria-label="Go back to home"
                className="group relative p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoIosArrowBack size={24} className="text-orange-600 group-hover:text-orange-700 transition-colors" />
              </motion.button>
              
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <IoIosCart className="text-orange-500" />
                  Track and manage your food orders
                </p>
              </div>
            </div>

            {/* Order Statistics */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-orange-100 min-w-[120px] hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-2 text-orange-600">
                  <IoIosList size={20} />
                  <span className="font-semibold">Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-yellow-100 min-w-[120px] hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-2 text-yellow-600">
                  <IoIosTime size={20} />
                  <span className="font-semibold">Pending</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-green-100 min-w-[120px] hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-2 text-green-600">
                  <IoIosCheckmarkCircle size={20} />
                  <span className="font-semibold">Delivered</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.delivered}</p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-red-100 min-w-[120px] hover:shadow-xl transition-all duration-200">
                <div className="flex items-center gap-2 text-red-600">
                  <IoIosCloseCircle size={20} />
                  <span className="font-semibold">Cancelled</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.cancelled}</p>
              </div>
            </motion.div>
          </motion.header>

          {/* Order Statistics Visualization */}
          {orderStatsData.length > 0 && (
            <motion.section
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaChartBar className="text-orange-500" />
                  Order Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {orderStatsData.map((stat, index) => (
                    <motion.div
                      key={stat.name}
                      className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{ borderColor: stat.color }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Search and Filter Section */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by order ID or shop name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-2xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="total-high">Total: High to Low</option>
                  <option value="total-low">Total: Low to High</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaSortAmountDown className="text-gray-400" />
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-2xl border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IoIosList size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaChartBar size={16} />
                </button>
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <FaFilter className="text-orange-500" />
                  <span className="font-semibold text-gray-700">Filter</span>
                  <motion.span
                    animate={{ rotate: isFilterOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isFilterOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-orange-100 p-4 z-50 min-w-[280px]"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {orderStatusFilters.map((filter) => (
                          <button
                            key={filter.key}
                            onClick={() => {
                              setActiveFilter(filter.key);
                              setIsFilterOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                              activeFilter === filter.key
                                ? 'bg-orange-50 border-2 border-orange-500 text-orange-700'
                                : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                          >
                            <span className={`text-lg ${filter.color}`}>
                              {filter.icon}
                            </span>
                            <span className="font-medium text-sm">{filter.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-gray-600 font-medium">Active Filters:</span>
                
                {activeFilter !== 'all' && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold text-sm capitalize flex items-center gap-2">
                    {orderStatusFilters.find(f => f.key === activeFilter)?.label}
                    <button
                      onClick={() => setActiveFilter('all')}
                      className="hover:text-orange-900"
                      aria-label={`Remove ${activeFilter} filter`}
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {searchTerm && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm flex items-center gap-2">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="hover:text-blue-900"
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {sortBy !== 'newest' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm flex items-center gap-2">
                    Sort: {sortBy.replace('-', ' ')}
                    <button
                      onClick={() => setSortBy('newest')}
                      className="hover:text-purple-900"
                      aria-label="Reset sort"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </motion.section>

          {/* Results Count */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-600">
              Showing {filteredOrders.length} of {myOrders?.length || 0} orders
              {hasActiveFilters && ' (filtered)'}
            </p>
          </motion.div>

          {/* Orders List */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-live="polite"
            aria-relevant="additions"
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}
          >
            <AnimatePresence mode="wait">
              {filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id || index}
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  >
                    {userData?.role === "user" ? (
                      <UserOrderCard data={order} viewMode={viewMode} />
                    ) : userData?.role === "owner" ? (
                      <OwnerOrderCard data={order} viewMode={viewMode} />
                    ) : null}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 col-span-full"
                  role="alert"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
                      <FaBoxOpen className="text-4xl text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                      {myOrders?.length === 0 ? "No Orders Found" : "No Matching Orders"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {myOrders?.length === 0 
                        ? "You haven't placed any orders yet. Start exploring our delicious menu!"
                        : `No orders match your current filters. Try adjusting your search criteria.`
                      }
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MyOrders;