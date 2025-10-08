import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import { serverUrl } from "../../App";
import axios from "axios";

const DropdownUser = ({ darkMode }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Close dropdown on escape key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {userData?.fullName?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          {/* Online Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
        </div>

        {/* User Info - Hidden on small screens */}
        <div className="hidden lg:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {userData?.fullName || 'Admin User'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {userData?.role || 'admin'}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <div className="hidden sm:block">
          <span className={`text-gray-400 transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}>
            ▼
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          ref={dropdown}
          className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg border ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } z-50`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {userData?.fullName?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {userData?.fullName || 'Admin User'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {userData?.email || 'admin@example.com'}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 rounded-lg disabled:opacity-50"
            >
              <span className="text-lg">{isLoggingOut ? '⏳' : '🚪'}</span>
              <span className="font-medium">
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
