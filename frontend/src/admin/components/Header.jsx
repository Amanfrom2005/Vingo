import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiBell, FiSettings, FiHome } from "react-icons/fi";
import DropdownUser from "./DropdownUser";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setIsSearchOpen(false);
    }
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    return path.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Close search when clicking outside (for mobile search)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSearchOpen && !e.target.closest('.search-container')) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-30 flex w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-grow items-center justify-between p-4 md:px-6 w-full">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Enhanced Mobile Menu Button */}
          <motion.button
            aria-controls="sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="z-50 block rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 shadow-sm lg:hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="relative block h-5 w-5"
              animate={sidebarOpen ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span 
                className="absolute top-0.5 left-0.5 block h-0.5 w-4 rounded-full bg-gray-600 dark:bg-gray-300"
                animate={sidebarOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="absolute top-2 left-0.5 block h-0.5 w-4 rounded-full bg-gray-600 dark:bg-gray-300"
                animate={sidebarOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.1 }}
              />
              <motion.span 
                className="absolute top-3.5 left-0.5 block h-0.5 w-4 rounded-full bg-gray-600 dark:bg-gray-300"
                animate={sidebarOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.span>
          </motion.button>

          {/* Logo for Mobile */}
          <Link to="/admin" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 lg:hidden">
            Admin
          </Link>

          {/* Breadcrumb */}
          <nav className="hidden md:block">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link 
                  to="/admin" 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <FiHome size={14} />
                  Dashboard
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <motion.span 
                  className="text-gray-900 dark:text-gray-200 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {getCurrentPage()}
                </motion.span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Center Section - Search Bar */}
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              key="search-open"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute left-0 right-0 top-0 bottom-0 flex items-center bg-white dark:bg-gray-900 z-40 search-container"
            >
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto px-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Search users, orders, shops, items..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <FiX size={24} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="search-closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:flex items-center gap-4"
            >
              {/* Desktop Search Bar */}
              <form onSubmit={handleSearch} className="hidden lg:block max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                    placeholder="Search..."
                  />
                </div>
              </form>

              {/* Mobile Search Button */}
              <motion.button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSearch size={20} className="text-gray-600 dark:text-gray-400" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <motion.button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiBell size={20} className="text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* Settings */}
          <motion.button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSettings size={20} className="text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* User Profile Dropdown */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;