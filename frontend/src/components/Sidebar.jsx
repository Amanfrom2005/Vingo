import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  AiOutlineHome, 
  AiOutlineShoppingCart, 
  AiOutlineQuestion,
  AiOutlineFileText,
  AiOutlineSafetyCertificate,
  AiOutlineCustomerService,
  AiOutlineClose,
  AiOutlineContacts,
  AiOutlineAccountBook
} from 'react-icons/ai';
import { TbReceipt2 } from 'react-icons/tb';
import Profile from './Profile';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { userData, cartItems } = useSelector(state => state.user);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    {
      icon: AiOutlineHome,
      label: 'Home',
      path: '/',
      badge: null
    },
    {
      icon: AiOutlineShoppingCart,
      label: 'Cart',
      path: '/cart',
      badge: cartItems?.length > 0 ? cartItems.length : null,
      show: userData?.role === 'user'
    },
    {
      icon: TbReceipt2,
      label: 'My Orders',
      path: '/my-orders',
      badge: null
    },
    {
      icon: AiOutlineQuestion,
      label: 'FAQ',
      path: '/faq',
      badge: null
    },
    {
      icon: AiOutlineFileText,
      label: 'Privacy Policy',
      path: '/privacy-policy',
      badge: null
    },
    {
      icon: AiOutlineSafetyCertificate,
      label: 'License',
      path: '/license',
      badge: null
    },
    {
      icon: AiOutlineAccountBook,
      label: 'About Us',
      path: '/about',
      badge: null
    },
    {
      icon: AiOutlineContacts,
      label: 'Conatc Us',
      path: '/contact',
      badge: null
    },
    {
      icon: AiOutlineCustomerService,
      label: 'Help & Support',
      path: '/help',
      badge: null
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[10000] ${
          isOpen ? 'opacity-50 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-[10001] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#ff4d2d] font-bold text-lg">V</span>
            </div>
            <h2 className="text-xl font-bold text-white">Vingo</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
          >
            <AiOutlineClose size={20} className="text-white" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <Profile />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2 px-4">
            {menuItems.map((item) => {
              if (item.show === false) return null;
              
              const IconComponent = item.icon;
              
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-[#ff4d2d] transition-all duration-200 text-gray-700 font-medium group"
                >
                  <div className="relative">
                    <IconComponent 
                      size={22} 
                      className="group-hover:text-[#ff4d2d] transition-colors duration-200" 
                    />
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 bg-[#ff4d2d] text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="text-gray-400 group-hover:text-[#ff4d2d] transition-colors duration-200">
                    ›
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-500">Vingo App v2.1.0</p>
            <p className="text-xs text-gray-400 mt-1">Made with ❤️ for food lovers</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
