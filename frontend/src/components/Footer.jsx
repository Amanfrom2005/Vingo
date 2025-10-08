import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaUtensils,
  FaShippingFast,
  FaShieldAlt,
  FaHeart
} from "react-icons/fa";
import { MdOutlineLocalOffer, MdSupportAgent } from "react-icons/md";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate subscription success
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
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

  const features = [
    { icon: <FaShippingFast />, text: "Fast Delivery" },
    { icon: <FaUtensils />, text: "Fresh Food" },
    { icon: <MdOutlineLocalOffer />, text: "Best Offers" },
    { icon: <FaShieldAlt />, text: "Secure Payment" }
  ];

  return (
    <footer className="bg-gradient-to-br w-full from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Features Banner */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="text-orange-500 text-2xl mb-2">
                {feature.icon}
              </div>
              <span className="text-white text-sm font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <h3 className="text-white text-2xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                Vingo
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">
              Your trusted platform for quick and delicious food delivery from local restaurants. Quality meals delivered fast to your doorstep.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF />, href: "https://facebook.com", color: "hover:text-blue-600" },
                { icon: <FaTwitter />, href: "https://twitter.com", color: "hover:text-blue-400" },
                { icon: <FaInstagram />, href: "https://instagram.com", color: "hover:text-pink-500" },
                { icon: <FaLinkedinIn />, href: "https://linkedin.com", color: "hover:text-blue-700" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.href.split('.')[1]}
                  className={`w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 ${social.color} transition-all duration-300 hover:bg-white/10 hover:border-white/20`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <MdSupportAgent className="text-orange-500" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["About Us", "Menu", "My Orders", "Contact", "FAQ", "Support"].map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-500" />
              Contact Us
            </h3>
            <address className="not-italic text-gray-400 space-y-3">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Vingo Inc.</p>
                  <p>123 Food Street, Flavor Town</p>
                  <p>FT 45678, India</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-orange-500 flex-shrink-0" />
                <a href="mailto:support@vingo.com" className="hover:text-orange-400 transition-colors">
                  support@vingo.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-orange-500 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-orange-400 transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </address>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <FaEnvelope className="text-orange-500" />
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Get exclusive offers & latest updates delivered to your inbox.
            </p>
            
            <AnimatePresence mode="wait">
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center"
                >
                  <div className="text-green-400 text-sm font-medium">
                    🎉 Thank you for subscribing!
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="space-y-3"
                >
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                      aria-label="Email address for newsletter"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe Now
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Vingo. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</a>
            <a href="/cookies" className="hover:text-orange-400 transition-colors">Cookies</a>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            Made with <FaHeart className="text-red-500 mx-1" /> by Vingo Team
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;