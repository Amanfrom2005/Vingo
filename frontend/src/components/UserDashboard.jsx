import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import ImageSlider from "./ImageSlider";
import { motion, AnimatePresence } from "framer-motion";

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(
    (state) => state.user
  );

  const cateScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const navigate = useNavigate();

  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  // Filter items by category
  // const handleFilterByCategory = (category) => {
  //   if (category === "All") {
  //     setUpdatedItemsList(itemsInMyCity || []);
  //   } else {
  //     const filteredList = itemsInMyCity?.filter(
  //       (item) => item.category === category
  //     );
  //     setUpdatedItemsList(filteredList || []);
  //   }
  // };

  // Initialize updatedItemsList on itemsInMyCity change
  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity || []);
  }, [itemsInMyCity]);

  // Update visibility of scroll buttons
  const updateButtonVisibility = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0);
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  // Scroll handler for category and shop sections
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  // Add scroll event listeners and update buttons on categories and shops
  useEffect(() => {
    if (!cateScrollRef.current || !shopScrollRef.current) return;

    // Listener callbacks
    const onCateScroll = () =>
      updateButtonVisibility(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton
      );
    const onShopScroll = () =>
      updateButtonVisibility(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton
      );

    // Initial button visibility
    updateButtonVisibility(
      cateScrollRef,
      setShowLeftCateButton,
      setShowRightCateButton
    );
    updateButtonVisibility(
      shopScrollRef,
      setShowLeftShopButton,
      setShowRightShopButton
    );

    // Attach event listeners
    cateScrollRef.current.addEventListener("scroll", onCateScroll);
    shopScrollRef.current.addEventListener("scroll", onShopScroll);

    // Cleanup listeners on unmount
    return () => {
      cateScrollRef.current?.removeEventListener("scroll", onCateScroll);
      shopScrollRef.current?.removeEventListener("scroll", onShopScroll);
    };
  }, [categories]);

  const checkScrollButtons = () => {
    if (shopScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = shopScrollRef.current;
      setShowLeftShopButton(scrollLeft > 0);
      setShowRightShopButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />

      {/* Search Results */}
      {searchItems && searchItems.length > 0 && (
        <section
          aria-label="Search Results"
          className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4"
        >
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">
            Search Results
          </h1>
          <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </section>
      )}

      <HeroSection />

      <ImageSlider />

      {/* Inspiration for your first order - Categories
      <section className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]" aria-label="Categories">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">Our Food's category</h1>
        <div className="w-full relative">
          <div
            ref={cateScrollRef}
            className="w-full flex overflow-x-auto gap-4 pb-2 no-scrollbar"
            tabIndex={0}
            aria-live="polite"
          >
            {categories.map((cate, index) => (
              <div className="w-20 h-10 bg-amber-300 text-amber-50 flex items-center"
                key={cate.category + index}
                name={cate.category}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* Best Shops in Current City */}
      <motion.section
        className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-6"
        aria-label={`Best shops in ${currentCity}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Section Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-gray-800 text-2xl sm:text-4xl font-bold mb-2">
              Best Shops in{" "}
              <span className="text-[#ff4d2d]">{currentCity}</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Discover top-rated local shops near you
            </p>
          </div>
          <button
            className="hidden md:flex items-center gap-2 text-[#ff4d2d] hover:text-[#e64528] font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-orange-50"
            onClick={() => navigate("/all-shops")}
          >
            View All
            <FaCircleChevronRight />
          </button>
        </div>

        {/* Shops Scroll Container */}
        <div className="relative group">
          <AnimatePresence>
            {showLeftShopButton && (
              <motion.button
                aria-label="Scroll shops left"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-[#ff4d2d] p-3 rounded-full shadow-2xl hover:bg-white hover:scale-110 z-20 border border-gray-200 transition-all duration-300"
                onClick={() => scrollHandler(shopScrollRef, "left")}
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaCircleChevronLeft size={24} />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div
            ref={shopScrollRef}
            className="w-full flex overflow-x-auto gap-6 pb-6 no-scrollbar scroll-smooth"
            tabIndex={0}
            aria-live="polite"
            onScroll={checkScrollButtons}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard
                key={shop._id || index}
                name={shop.name}
                image={shop.image}
                rating={shop.rating?.average}
                deliveryTime={shop.deliveryTime}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            ))}
          </motion.div>

          <AnimatePresence>
            {showRightShopButton && (
              <motion.button
                aria-label="Scroll shops right"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-[#ff4d2d] p-3 rounded-full shadow-2xl hover:bg-white hover:scale-110 z-20 border border-gray-200 transition-all duration-300"
                onClick={() => scrollHandler(shopScrollRef, "right")}
                type="button"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaCircleChevronRight size={24} />
              </motion.button>
            )}
          </AnimatePresence>

        </div>

        {/* Mobile View All Button */}
        <button
          className="md:hidden flex items-center justify-center gap-2 text-[#ff4d2d] hover:text-[#e64528] font-semibold transition-colors px-6 py-3 rounded-xl border-2 border-[#ff4d2d] w-fit mx-auto"
          onClick={() => navigate("/all-shops")}
        >
          View All Shops
          <FaCircleChevronRight />
        </button>
      </motion.section>

      {/* Suggested Food Items */}
      <section
        className="w-full max-w-7xl flex flex-col gap-5 items-start p-[10px]"
        aria-label="Suggested food items"
      >
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Suggested Food Items
        </h1>
        <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
          {updatedItemsList?.map((item, index) => (
            <FoodCard key={item._id || index} data={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;
