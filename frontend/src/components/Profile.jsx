import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AiOutlineMail, 
  AiOutlineCalendar,
  AiOutlineShoppingCart,
  AiOutlineDollar,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineLogout
} from 'react-icons/ai';
import { 
  FaUser,
  FaStore,
  FaMotorcycle,
  FaRupeeSign,
  FaBoxOpen,
  FaChartLine,
  FaStar,
  FaClock
} from 'react-icons/fa';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import Nav from './Nav';
import Footer from './Footer';

const Profile = ({ fullView = false, onClose }) => {
  const { userData, cartItems, myOrders } = useSelector(state => state.user);
  const { myShopData } = useSelector(state => state.owner);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      fetchUserStats();
    }
  }, [userData]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${serverUrl}/api/user/stats`, {
        withCredentials: true
      });
      
      if (response.data && response.data.stats) {
        setUserStats(response.data.stats);
      } else {
        // Generate stats from available real data if API doesn't return stats
        generateStatsFromRealData();
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setError('Failed to load statistics');
      // Generate stats from available real data as fallback
      generateStatsFromRealData();
    } finally {
      setLoading(false);
    }
  };

  const generateStatsFromRealData = () => {
    if (!userData) return;

    const baseStats = {
      joinDate: userData.createdAt,
      avgRating: 4.5 // Default average rating
    };

    if (userData.role === 'user') {
      const totalOrders = myOrders?.length || 0;
      const totalSpent = myOrders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
      
      setUserStats({
        ...baseStats,
        totalOrders,
        totalSpent,
        favoriteCategories: getTopCategories(),
        completedOrders: totalOrders
      });
    } else if (userData.role === 'owner' && myShopData) {
      const menuItems = myShopData.items?.length || 0;
      const totalOrders = myShopData.orders?.length || 0;
      const totalRevenue = myShopData.orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
      
      setUserStats({
        ...baseStats,
        menuItems,
        totalOrders,
        totalRevenue,
        activeItems: menuItems,
        shopRating: myShopData.rating?.average || 4.5
      });
    } else if (userData.role === 'deliveryBoy') {
      // For delivery boys, we'll use basic stats since we don't have real delivery data
      setUserStats({
        ...baseStats,
        completedDeliveries: 0,
        totalEarnings: 0,
        avgDeliveryTime: 0,
        rating: 4.5
      });
    }
  };

  const getTopCategories = () => {
    if (!myOrders || myOrders.length === 0) return ['No orders yet'];
    
    const categoryCount = {};
    myOrders.forEach(order => {
      order.shopOrders?.forEach(shopOrder => {
        shopOrder.shopOrderItems?.forEach(item => {
          const category = item.category || 'Other';
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
      });
    });
    
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/signin");
      if (onClose) onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserRadarData = () => {
    if (!userStats) return [];

    if (userData.role === 'user') {
      return [
        { subject: 'Orders', A: Math.min((userStats.totalOrders || 0) * 20, 100) },
        { subject: 'Spending', A: Math.min((userStats.totalSpent || 0) / 100, 100) },
        { subject: 'Activity', A: Math.min((userStats.totalOrders || 0) * 15, 100) },
        { subject: 'Loyalty', A: 70 },
        { subject: 'Reviews', A: 60 }
      ];
    } else if (userData.role === 'owner') {
      return [
        { subject: 'Items', A: Math.min((userStats.menuItems || 0) * 10, 100) },
        { subject: 'Orders', A: Math.min((userStats.totalOrders || 0) * 5, 100) },
        { subject: 'Revenue', A: Math.min((userStats.totalRevenue || 0) / 200, 100) },
        { subject: 'Rating', A: (userStats.shopRating || 0) * 20 },
        { subject: 'Growth', A: 65 }
      ];
    } else if (userData.role === 'deliveryBoy') {
      return [
        { subject: 'Deliveries', A: Math.min((userStats.completedDeliveries || 0) * 2, 100) },
        { subject: 'Speed', A: Math.max(100 - (userStats.avgDeliveryTime || 0), 60) },
        { subject: 'Rating', A: (userStats.rating || 0) * 20 },
        { subject: 'Earnings', A: Math.min((userStats.totalEarnings || 0) / 50, 100) },
        { subject: 'Reliability', A: 85 }
      ];
    }
    return [];
  };

  const getPieChartData = () => {
    if (!userStats) return [];

    if (userData.role === 'user') {
      const completedOrders = userStats.completedOrders || 0;
      const pendingOrders = (userStats.totalOrders || 0) - completedOrders;
      
      return [
        { name: 'Delivered', value: completedOrders, color: '#10B981' },
        { name: 'Pending', value: pendingOrders, color: '#F59E0B' },
        { name: 'In Cart', value: cartItems.length, color: '#EF4444' }
      ].filter(item => item.value > 0);
    } else if (userData.role === 'owner') {
      const activeItems = userStats.activeItems || 0;
      const totalItems = userStats.menuItems || 0;
      const inactiveItems = Math.max(0, totalItems - activeItems);
      
      return [
        { name: 'Active Items', value: activeItems, color: '#10B981' },
        { name: 'Inactive Items', value: inactiveItems, color: '#6B7280' }
      ].filter(item => item.value > 0);
    } else if (userData.role === 'deliveryBoy') {
      const completed = userStats.completedDeliveries || 0;
      const inProgress = userStats.inProgressDeliveries || 0;
      
      return [
        { name: 'Completed', value: completed, color: '#10B981' },
        { name: 'In Progress', value: inProgress, color: '#F59E0B' }
      ].filter(item => item.value > 0);
    }
    return [];
  };

  const getRoleIcon = () => {
    switch (userData.role) {
      case 'owner':
        return <FaStore className="text-orange-500" />;
      case 'deliveryBoy':
        return <FaMotorcycle className="text-blue-500" />;
      default:
        return <FaUser className="text-green-500" />;
    }
  };

  const getRoleColor = () => {
    switch (userData.role) {
      case 'owner':
        return 'from-orange-500 to-amber-500';
      case 'deliveryBoy':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4d2d]"></div>
      </div>
    );
  }

  const CompactProfile = () => (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRoleColor()} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
          {userData?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{userData.fullName}</h3>
          <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
            {getRoleIcon()}
            {userData.role}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2">
            <AiOutlineFileText className="text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-medium">Orders</p>
              <p className="font-bold text-blue-800">{userStats?.totalOrders || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-xl border border-green-200">
          <div className="flex items-center gap-2">
            {userData.role === 'user' ? 
              <AiOutlineShoppingCart className="text-green-600" /> : 
              <AiOutlineDollar className="text-green-600" />
            }
            <div>
              <p className="text-xs text-green-600 font-medium">
                {userData.role === 'user' ? 'In Cart' : 
                 userData.role === 'owner' ? 'Revenue' : 'Earnings'}
              </p>
              <p className="font-bold text-green-800">
                {userData.role === 'user' ? cartItems.length : 
                 userData.role === 'owner' ? `₹${userStats?.totalRevenue || 0}` : 
                 `₹${userStats?.totalEarnings || 0}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => navigate('/profile')}
        className="w-full py-2 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Full Profile
      </motion.button>
    </motion.div>
  );

  const FullProfile = () => (
    <>
    <Nav />
     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <motion.button
            onClick={onClose || (() => navigate('/'))}
            className="p-3 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-2xl">✕</span>
          </motion.button>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getRoleColor()} flex items-center justify-center text-white font-bold text-4xl shadow-2xl`}>
              {userData?.fullName?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{userData.fullName}</h2>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize flex items-center gap-2 ${
                  userData.role === 'owner' ? 'bg-orange-100 text-orange-800' :
                  userData.role === 'deliveryBoy' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {getRoleIcon()}
                  {userData.role}
                </span>
                <span className="flex items-center gap-2 text-gray-500">
                  <FaStar className="text-yellow-400" />
                  {userStats?.avgRating || 4.5}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <AiOutlineMail className="text-orange-500" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AiOutlineCalendar className="text-orange-500" />
                  <span>Joined {formatDate(userData.createdAt)}</span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleLogOut}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AiOutlineLogout />
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <motion.div 
            className="xl:col-span-2 bg-white rounded-3xl shadow-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaChartLine className="text-orange-500" />
              Performance Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={getUserRadarData()}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Performance"
                  dataKey="A"
                  stroke="#ff4d2d"
                  fill="#ff4d2d"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Distribution Chart */}
          <motion.div 
            className="bg-white rounded-3xl shadow-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaBoxOpen className="text-orange-500" />
              Activity Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {getPieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              {getPieChartData().map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            {userData.role === 'user' ? '📊 Shopping Statistics' : 
             userData.role === 'owner' ? '🏪 Business Overview' : '🚗 Delivery Performance'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {userData.role === 'user' && (
              <>
                <StatCard
                  icon={<AiOutlineFileText className="text-blue-500" />}
                  value={userStats?.totalOrders || 0}
                  label="Total Orders"
                  color="blue"
                />
                <StatCard
                  icon={<FaRupeeSign className="text-green-500" />}
                  value={userStats?.totalSpent || 0}
                  label="Total Spent"
                  color="green"
                  isCurrency
                />
                <StatCard
                  icon={<AiOutlineShoppingCart className="text-orange-500" />}
                  value={cartItems.length}
                  label="Items in Cart"
                  color="orange"
                />
                <StatCard
                  icon={<FaStar className="text-purple-500" />}
                  value={userStats?.avgRating || 4.5}
                  label="Avg Rating"
                  color="purple"
                  isRating
                />
              </>
            )}
            
            {userData.role === 'owner' && (
              <>
                <StatCard
                  icon={<FaBoxOpen className="text-orange-500" />}
                  value={userStats?.menuItems || 0}
                  label="Menu Items"
                  color="orange"
                />
                <StatCard
                  icon={<FaRupeeSign className="text-green-500" />}
                  value={userStats?.totalRevenue || 0}
                  label="Total Revenue"
                  color="green"
                  isCurrency
                />
                <StatCard
                  icon={<AiOutlineFileText className="text-blue-500" />}
                  value={userStats?.totalOrders || 0}
                  label="Total Orders"
                  color="blue"
                />
                <StatCard
                  icon={<FaStar className="text-purple-500" />}
                  value={userStats?.shopRating || 4.5}
                  label="Shop Rating"
                  color="purple"
                  isRating
                />
              </>
            )}
            
            {userData.role === 'deliveryBoy' && (
              <>
                <StatCard
                  icon={<FaBoxOpen className="text-orange-500" />}
                  value={userStats?.completedDeliveries || 0}
                  label="Completed"
                  color="orange"
                />
                <StatCard
                  icon={<FaRupeeSign className="text-green-500" />}
                  value={userStats?.totalEarnings || 0}
                  label="Total Earnings"
                  color="green"
                  isCurrency
                />
                <StatCard
                  icon={<FaClock className="text-blue-500" />}
                  value={Math.round(userStats?.avgDeliveryTime || 0)}
                  label="Avg Time (min)"
                  color="blue"
                />
                <StatCard
                  icon={<FaStar className="text-purple-500" />}
                  value={userStats?.rating || 4.5}
                  label="Rating"
                  color="purple"
                  isRating
                />
              </>
            )}
          </div>

          {/* Favorite Categories for Users */}
          {userData.role === 'user' && userStats?.favoriteCategories && (
            <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl border border-orange-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Favorite Categories</h4>
              <div className="flex flex-wrap gap-3">
                {userStats.favoriteCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-orange-700 border border-orange-200 shadow-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );

  // Stat Card Component
  const StatCard = ({ icon, value, label, color, isCurrency = false, isRating = false }) => (
    <motion.div 
      className={`p-6 rounded-2xl border-2 bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-200 hover:shadow-lg transition-all duration-200`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {isCurrency ? `₹${value}` : isRating ? `${value}★` : value}
          </p>
          <p className={`text-sm font-medium text-${color}-600`}>{label}</p>
        </div>
      </div>
    </motion.div>
  );

  return fullView ? <FullProfile /> : <CompactProfile />;
};

export default Profile;