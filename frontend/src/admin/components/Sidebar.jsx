import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiHome, 
  FiUsers, 
  FiShoppingBag, 
  FiPackage, 
  FiChevronRight, 
  FiChevronLeft, 
  FiX, 
  FiMenu, 
  FiUser, 
  FiHelpCircle, 
  FiShield, 
  FiBook, 
  FiInfo, 
  FiMail, 
  FiStar, 
  FiDollarSign, 
  FiFileText, 
  FiPhone, 
  FiLifeBuoy,
  FiClock,
  FiCheckCircle
} from "react-icons/fi";

const Sidebar = ({ sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed }) => {
  const location = useLocation();
  const { pathname } = location;
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const trigger = useRef(null);
  const sidebar = useRef(null);

  // Close sidebar on click outside (mobile)
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Close sidebar if clicking on navlink (mobile)
  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FiHome,
      exact: true
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: FiUsers,
    },
    {
      name: "Shops",
      path: "/admin/shops",
      icon: FiShoppingBag,
    },
    {
      name: "Items",
      path: "/admin/items",
      icon: FiPackage,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiPackage,
      submenu: [
        { name: "All Orders", path: "/admin/orders", icon: FiFileText },
        { name: "Pending", path: "/admin/orders?status=pending", icon: FiClock },
        { name: "Delivered", path: "/admin/orders?status=delivered", icon: FiCheckCircle }
      ]
    }
  ];

  const handleSubmenuToggle = (itemName) => {
    if (sidebarCollapsed) return;
    setActiveSubmenu(activeSubmenu === itemName ? null : itemName);
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path) && pathname !== '/admin';
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen flex-col overflow-y-hidden bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-gray-200 dark:border-gray-700 shadow-xl lg:shadow-none ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${sidebarCollapsed ? "lg:w-16" : "lg:w-64"} w-64`}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center justify-between gap-2 px-6 py-5 lg:py-6 border-b border-gray-200 dark:border-gray-700 ${
        sidebarCollapsed ? 'lg:px-3' : ''
      }`}>
        <NavLink to="/admin" className={`flex items-center gap-3 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-bold">
            A
          </div>
          {!sidebarCollapsed && (
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Admin Panel
            </span>
          )}
        </NavLink>
        
        {/* Mobile Close Button */}
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="sr-only">Close sidebar</span>
          <FiX size={20} className="text-gray-600 dark:text-gray-400" />
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:block p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FiChevronLeft size={20} className={`text-gray-600 dark:text-gray-400 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-5 py-4 px-4 lg:px-6 flex-1 overflow-y-auto">
        {/* User Info */}
        {!sidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Admin User</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Super Admin</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full" title="Online"></div>
            </div>
          </motion.div>
        )}

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              {/* Main Menu Item */}
              <div className="relative">
                {item.submenu ? (
                  <button
                    onClick={() => handleSubmenuToggle(item.name)}
                    className={`group relative flex items-center gap-2.5 rounded-lg py-2.5 px-3 font-medium duration-300 ease-in-out hover:bg-blue-50 dark:hover:bg-blue-900/20 w-full text-left ${
                      pathname.startsWith(item.path) && pathname !== '/admin'
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  >
                    <item.icon size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <FiChevronRight size={16} className={`transition-transform duration-200 ${activeSubmenu === item.name ? 'rotate-90' : ''}`} />
                      </>
                    )}
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={closeSidebar}
                    className={({ isActive: linkActive }) => 
                      `group relative flex items-center gap-2.5 rounded-lg py-2.5 px-3 font-medium duration-300 ease-in-out hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                        (item.exact ? pathname === item.path : linkActive) || isActive(item.path, item.exact)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`
                    }
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <item.icon size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )}

                {/* Tooltip for collapsed sidebar */}
                {sidebarCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </div>

              {/* Submenu */}
              {item.submenu && !sidebarCollapsed && (
                <AnimatePresence>
                  {activeSubmenu === item.name && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="ml-4 mt-1 space-y-1 overflow-hidden"
                    >
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          onClick={closeSidebar}
                          className={({ isActive: linkActive }) =>
                            `flex items-center gap-2.5 rounded-lg py-2 px-3 text-sm font-medium duration-300 ease-in-out hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                              linkActive || pathname === subItem.path
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            }`
                          }
                        >
                          <subItem.icon size={16} className="text-gray-500 dark:text-gray-500" />
                          <span>{subItem.name}</span>
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        {!sidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-auto pt-6"
          >
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                <h4 className="font-semibold text-sm mb-1">Need Help?</h4>
                <p className="text-xs opacity-90 mb-3">Check our documentation</p>
                <button className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">
                  View Docs
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;