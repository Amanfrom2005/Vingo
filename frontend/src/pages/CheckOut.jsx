import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from '../redux/mapSlice';
import { 
  MdDeliveryDining, 
  MdPayments, 
  MdSecurity,
  MdDiscount 
} from "react-icons/md";
import { 
  FaCreditCard, 
  FaShieldAlt,
  FaStore,
  FaMapMarkerAlt
} from "react-icons/fa";
import { RiTimerFlashFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { addMyOrder } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';
import { FaMobileScreenButton } from 'react-icons/fa6';

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location.lat && location.lon) {
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
  }, [location, map]);

  return null;
}

function CheckOut() {
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount, userData } = useSelector((state) => state.user);
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(40);
  const [estimatedTime, setEstimatedTime] = useState("25-35 min");
  const [isMapLoading, setIsMapLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  const AmountWithDeliveryFee = totalAmount + deliveryFee;
  const discount = totalAmount > 500 ? 40 : 0; // Free delivery discount
  const finalAmount = AmountWithDeliveryFee - discount;

  useEffect(() => {
    // Update delivery fee based on totalAmount threshold
    const newDeliveryFee = totalAmount > 500 ? 0 : 40;
    setDeliveryFee(newDeliveryFee);
    
    // Update estimated time based on distance/amount
    const time = totalAmount > 500 ? "20-30 min" : "25-35 min";
    setEstimatedTime(time);
  }, [totalAmount]);

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  const onDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    dispatch(setLocation({ lat, lon: lng }));
    await getAddressByLatLng(lat, lng);
  };

  const getCurrentLocation = async () => {
    if (!userData?.location?.coordinates) {
      alert("User location not available.");
      return;
    }
    setIsMapLoading(true);
    const latitude = userData.location.coordinates[1];
    const longitude = userData.location.coordinates[0];
    dispatch(setLocation({ lat: latitude, lon: longitude }));
    await getAddressByLatLng(latitude, longitude);
    setIsMapLoading(false);
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );
      const addr = result?.data?.results?.[0]?.address_line2 || result?.data?.results?.[0]?.address_line1 || "";
      dispatch(setAddress(addr));
      setAddressInput(addr);
    } catch (error) {
      console.error("Failed to fetch address:", error);
    }
  };

  const getLatLngByAddress = async () => {
    if (!addressInput.trim()) {
      alert("Please enter an address.");
      return;
    }
    setIsMapLoading(true);
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.error("Failed to fetch lat/lng for address:", error);
    } finally {
      setIsMapLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    if (!addressInput.trim()) {
      alert("Please enter a delivery address");
      return;
    }
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon,
          },
          totalAmount: finalAmount,
          cartItems,
        },
        { withCredentials: true }
      );

      if (paymentMethod === "cod") {
        dispatch(addMyOrder(result.data));
        navigate("/order-placed");
      } else {
        openRazorpayWindow(result.data.orderId, result.data.razorOrder);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: 'INR',
      name: "Vingo",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async (response) => {
        try {
          const verifyResult = await axios.post(
            `${serverUrl}/api/order/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId,
            },
            { withCredentials: true }
          );
          dispatch(addMyOrder(verifyResult.data));
          navigate("/order-placed");
        } catch (error) {
          console.error("Payment verification failed:", error);
          alert("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        email: userData?.email,
        contact: userData?.mobile,
      },
      theme: {
        color: "#ff4d2d",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center p-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <motion.button
        type="button"
        className="absolute top-6 left-6 z-10 bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 group"
        onClick={() => navigate("/cart")}
        aria-label="Go back"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoIosArrowRoundBack size={28} className="text-orange-600 group-hover:text-orange-700 transition-colors" />
      </motion.button>

      <motion.div 
        className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Order Details */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <motion.header 
              className="text-center lg:text-left"
              variants={itemVariants}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                Checkout
              </h1>
              <p className="text-gray-600 mt-2 flex items-center justify-center lg:justify-start gap-2">
                <RiTimerFlashFill className="text-orange-500" />
                Estimated delivery: {estimatedTime}
              </p>
            </motion.header>

            {/* Delivery Location */}
            <motion.section 
              className="space-y-4"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
                <div className="bg-orange-100 p-2 rounded-xl">
                  <IoLocationSharp className="text-orange-600 text-xl" />
                </div>
                Delivery Location
              </h2>
              
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    aria-label="Delivery address input"
                    placeholder="Enter your delivery address..."
                    className="w-full pl-4 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label="Search address"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors duration-200"
                    onClick={getLatLngByAddress}
                  >
                    <IoSearchOutline size={18} />
                  </button>
                </div>
                <motion.button
                  type="button"
                  aria-label="Use current location"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-colors duration-200"
                  onClick={getCurrentLocation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TbCurrentLocation size={20} />
                </motion.button>
              </div>
            </motion.section>

            {/* Payment Method */}
            <motion.section 
              className="space-y-4"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
                <div className="bg-green-100 p-2 rounded-xl">
                  <MdPayments className="text-green-600 text-xl" />
                </div>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 gap-3">
                <motion.div
                  role="radio"
                  tabIndex={0}
                  aria-checked={paymentMethod === "cod"}
                  onClick={() => setPaymentMethod("cod")}
                  onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod("cod")}
                  className={`flex items-center gap-4 rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "cod"
                      ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <MdDeliveryDining className="text-green-600 text-2xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Cash On Delivery</p>
                    <p className="text-sm text-gray-600">Pay when your food arrives</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod" ? "border-orange-500 bg-orange-500" : "border-gray-300"
                    }`}>
                      {paymentMethod === "cod" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  role="radio"
                  tabIndex={0}
                  aria-checked={paymentMethod === "online"}
                  onClick={() => setPaymentMethod("online")}
                  onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod("online")}
                  className={`flex items-center gap-4 rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "online"
                      ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FaMobileScreenButton className="text-purple-600 text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">UPI / Credit / Debit Card</p>
                    <p className="text-sm text-gray-600">Pay securely online</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FaShieldAlt className="text-green-500 text-xs" />
                      <span className="text-xs text-green-600">100% Secure Payment</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "online" ? "border-orange-500 bg-orange-500" : "border-gray-300"
                    }`}>
                      {paymentMethod === "online" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          </div>

          {/* Right Column - Map and Summary */}
          <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-8 space-y-6">
            {/* Map Section */}
            <motion.section 
              className="space-y-4"
              variants={itemVariants}
            >
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <FaMapMarkerAlt className="text-white" />
                Delivery Location Map
              </h2>
              
              <div className="rounded-2xl overflow-hidden h-48 bg-white/20 backdrop-blur-sm border border-white/30">
                <AnimatePresence mode="wait">
                  {isMapLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <ClipLoader size={30} color="white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-full"
                    >
                      <MapContainer
                        className="w-full h-full"
                        center={[location?.lat || 0, location?.lon || 0]}
                        zoom={16}
                        scrollWheelZoom={false}
                        keyboard={true}
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <RecenterMap location={location} />
                        {location?.lat && location?.lon && (
                          <Marker
                            position={[location.lat, location.lon]}
                            draggable={true}
                            eventHandlers={{
                              dragend: onDragEnd,
                            }}
                          />
                        )}
                      </MapContainer>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Order Summary */}
            <motion.section 
              className="space-y-4"
              variants={itemVariants}
            >
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <FaStore className="text-white" />
                Order Summary
              </h2>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex justify-between items-center text-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold">{item.quantity}</span>
                        </div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-white/30 pt-3 space-y-2">
                    <div className="flex justify-between text-white/90">
                      <span>Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    
                    <div className="flex justify-between text-white/90">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-300">
                        <span className="flex items-center gap-1">
                          <MdDiscount className="text-green-300" />
                          Delivery Discount
                        </span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/30">
                      <span>Total Amount</span>
                      <span>₹{finalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Place Order Button */}
            <motion.button
              type="button"
              className="w-full bg-white text-orange-600 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePlaceOrder}
              disabled={loading}
              aria-busy={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <ClipLoader size={20} color="#ff4d2d" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {paymentMethod === "cod" ? (
                    <>
                      <MdDeliveryDining className="text-xl" />
                      <span>Place Order - ₹{finalAmount}</span>
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="text-xl" />
                      <span>Pay & Place Order - ₹{finalAmount}</span>
                    </>
                  )}
                </div>
              )}
            </motion.button>

            {/* Security Badge */}
            <motion.div 
              className="flex items-center justify-center gap-2 text-white/80 text-sm"
              variants={itemVariants}
            >
              <FaShieldAlt className="text-green-300" />
              <span>100% Secure | SSL Encrypted</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CheckOut;