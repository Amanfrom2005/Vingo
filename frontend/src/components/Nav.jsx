import React, { useEffect, useState, useRef } from 'react';
import { FaLocationDot, FaBars } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Profile from '../pages/ProfilePage';

function Nav() {
  const { userData, currentCity } = useSelector(state => state.user);
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  // Search functionality with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query && userData.role === "user") {
        handleSearchItems();
      } else {
        dispatch(setSearchItems(null));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, userData.role, currentCity, dispatch]);

  const handleSearchItems = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/search-items?query=${encodeURIComponent(query)}&city=${encodeURIComponent(currentCity)}`,
        { withCredentials: true }
      );
      dispatch(setSearchItems(result.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      setShowProfile(false);
      setShowProfilePage(false);
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewProfile = () => {
    setShowProfile(false);
    setShowSidebar(false);
    setShowProfilePage(true);
  };

  const handleCloseProfilePage = () => {
    setShowProfilePage(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[80px] flex items-center justify-between px-5 bg-white shadow-lg z-[9999] border-b border-gray-100">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Open Sidebar"
          >
            <FaBars size={20} className="text-[#ff4d2d]" />
          </button>

          {/* Logo */}
          <h1 
            className="text-2xl md:text-3xl font-bold text-[#ff4d2d] cursor-pointer select-none"
            onClick={() => {
              navigate("/");
              setShowProfilePage(false);
            }}
          >
            Vingo
          </h1>
        </div>

        {/* Mobile search bar */}
        {showSearch && userData.role === "user" && (
          <div className="fixed top-[80px] left-1/2 transform -translate-x-1/2 w-[90%] h-[70px] bg-white shadow-xl rounded-lg flex items-center gap-5 px-5 md:hidden z-50 animate-slideDown">
            <div className="flex items-center w-1/3 overflow-hidden gap-3 border-r-2 border-gray-200 text-gray-600 truncate">
              <FaLocationDot size={20} className="text-[#ff4d2d]" />
              <span title={currentCity} className="truncate text-sm">{currentCity}</span>
            </div>
            <div className="flex items-center w-2/3 gap-3">
              <IoIosSearch size={20} className="text-[#ff4d2d]" />
              <input
                type="search"
                placeholder="Search delicious food..."
                className="w-full px-3 py-2 text-gray-700 outline-none text-sm"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                autoComplete="off"
                autoFocus
              />
            </div>
            <button
              onClick={() => setShowSearch(false)}
              className="text-[#ff4d2d] hover:bg-gray-100 p-1 rounded"
            >
              <RxCross2 size={20} />
            </button>
          </div>
        )}

        {/* Desktop Search Bar */}
        {userData.role === "user" && (
          <div className="hidden md:flex md:w-2/5 lg:w-1/3 h-[60px] bg-gray-50 rounded-xl items-center gap-4 px-4 border border-gray-200 focus-within:border-[#ff4d2d] focus-within:bg-white transition-all duration-200">
            <div className="flex items-center gap-2 text-gray-600 border-r border-gray-300 pr-3">
              <FaLocationDot size={18} className="text-[#ff4d2d]" />
              <span className="text-sm font-medium truncate max-w-[100px]" title={currentCity}>
                {currentCity}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-1">
              <IoIosSearch size={20} className="text-[#ff4d2d]" />
              <input
                type="search"
                placeholder="Search delicious food..."
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                autoComplete="off"
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Toggle */}
          {userData.role === "user" && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label={showSearch ? "Close Search" : "Open Search"}
            >
              {showSearch ? (
                <RxCross2 size={20} className="text-[#ff4d2d]" />
              ) : (
                <IoIosSearch size={20} className="text-[#ff4d2d]" />
              )}
            </button>
          )}

          {/* User Avatar */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              title={userData?.fullName || "User"}
            >
              {userData?.fullName?.charAt(0).toUpperCase()}
            </button>

            {/* Quick Profile Dropdown */}
            {showProfile && (
              <div className="absolute top-[calc(100%_+_10px)] right-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-[9999] animate-slideDown">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] flex items-center justify-center text-white font-bold text-lg">
                    {userData?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{userData.fullName}</p>
                    <p className="text-sm text-gray-500 capitalize">{userData.role}</p>
                  </div>
                </div>
                
                <div className="py-3 space-y-2">
                  <Link
                    to={"/profile"}
                    onClick={handleViewProfile}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogOut}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar 
        isOpen={showSidebar} 
        onClose={() => setShowSidebar(false)} 
      />

      {/* Profile Page */}
      {showProfilePage && (
        <div className="fixed inset-0 z-[10000] bg-white">
          <Profile onClose={handleCloseProfilePage} />
        </div>
      )}
    </>
  );
}

export default Nav;