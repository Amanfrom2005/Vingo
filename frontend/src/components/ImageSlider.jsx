import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const slides = [
  {
    img: "/tranding/tranding-food-1.png",
    title: "Pizza",
    desc: "Delicious oven-baked pizza topped with fresh mozzarella, tangy tomato sauce, and your choice of classic toppings.",
  },
  {
    img: "/tranding/tranding-food-2.png",
    title: "Meatballs",
    desc: "Juicy meatballs made from premium ground meat, simmered in rich sauce and served with savory herbs.",
  },
  {
    img: "/tranding/tranding-food-3.png",
    title: "Burger",
    desc: "Freshly grilled burger with a tender beef patty, crisp lettuce, juicy tomato, and cheddar cheese in a toasted bun.",
  },
  {
    img: "/tranding/tranding-food-4.png",
    title: "Fish Soup",
    desc: "A hearty seafood soup featuring tender fish fillets and vegetables in a flavorful broth.",
  },
  {
    img: "/tranding/tranding-food-5.png",
    title: "Pancake",
    desc: "Fluffy pancakes served warm with maple syrup, fresh berries, and a touch of powdered sugar.",
  },
  {
    img: "/tranding/tranding-food-6.png",
    title: "Pastry",
    desc: "Buttery, golden pastries filled with sweet or savory fillings for a perfect snack or dessert.",
  },
  {
    img: "/tranding/tranding-food-7.png",
    title: "Sandwich",
    desc: "Classic sandwich layered with premium deli meats, crisp veggies, fresh cheese, and zesty sauces.",
  },
];

export default function ImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const thumbScrollRef = useRef(null);
  const autoScrollTimeoutRef = useRef(null);

  // Fixed scroll effect - only scroll when user interacts, not on initial load
  useEffect(() => {
    if (thumbScrollRef.current && isUserInteracting) {
      const thumb = thumbScrollRef.current.children[activeIndex];
      if (thumb) {
        // Clear any existing timeout
        if (autoScrollTimeoutRef.current) {
          clearTimeout(autoScrollTimeoutRef.current);
        }
        
        // Add small delay to ensure smooth animation
        autoScrollTimeoutRef.current = setTimeout(() => {
          thumb.scrollIntoView({ 
            behavior: "smooth", 
            inline: "center", 
            block: "nearest" 
          });
        }, 100);
      }
    }
  }, [activeIndex, isUserInteracting]);

  const nextSlide = () => {
    setIsUserInteracting(true);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsUserInteracting(true);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleThumbClick = (idx) => {
    setIsUserInteracting(true);
    setActiveIndex(idx);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main 
      className="flex flex-col items-center w-full min-h-screen relative bg-gradient-to-b from-amber-50 to-white px-2 pb-8"
      // Prevent anchor scrolling by setting overflow anchor to none
      style={{ overflowAnchor: 'none' }}
    >
      <header className="text-center max-w-2xl mx-auto pt-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-4">
          Inspiration Foods
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
          See our best trending foods in vingo.
        </p>
      </header>

      <section
        className="relative mt-8 w-full max-w-xl md:max-w-2xl lg:max-w-3xl 
        aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden bg-black/90 text-white"
      >
        {/* Image Slide with Overlay */}
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slides[activeIndex].title}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={slides[activeIndex].img}
                alt={slides[activeIndex].title}
                className="object-cover w-full h-full"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />
              {/* Text overlay */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-8"
              >
                <p className="uppercase tracking-widest text-sm text-green-300 mb-1">#Trending</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 drop-shadow text-orange-500">
                  {slides[activeIndex].title}
                </h2>
                <p className="text-base md:text-lg text-gray-100">{slides[activeIndex].desc}</p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button 
          aria-label="Previous Slide" 
          onClick={prevSlide}
          className="absolute top-2/4 left-3 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-amber-700 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md flex items-center justify-center transition-all duration-200"
        >
          <FaArrowLeft size={22} />
        </button>
        <button 
          aria-label="Next Slide"
          onClick={nextSlide}
          className="absolute top-2/4 right-3 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-amber-700 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md flex items-center justify-center transition-all duration-200"
        >
          <FaArrowRight size={22} />
        </button>
      </section>

      {/* Thumbnails */}
      <div 
        className="relative w-full mt-8 flex justify-center items-center"
        style={{ overflowAnchor: 'none' }}
      >
        <div
          ref={thumbScrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-transparent w-full max-w-2xl px-2 py-1"
          style={{ 
            scrollSnapType: 'x mandatory', 
            WebkitOverflowScrolling: "touch",
            overflowAnchor: 'none'
          }}
        >
          {slides.map((slide, idx) => (
            <motion.div
              key={slide.title}
              className={`min-w-[86px] w-20 h-24 sm:w-24 sm:h-28 flex flex-col items-center justify-end rounded-lg transition-all duration-200
              ${idx === activeIndex ? "border-2 border-orange-400 brightness-100 scale-105 shadow-lg" : "border border-gray-400 brightness-75"}
              cursor-pointer relative overflow-hidden group`}
              onClick={() => handleThumbClick(idx)}
              whileTap={{ scale: 0.96 }}
              style={{ scrollSnapAlign: 'center' }}
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="object-cover rounded-lg w-full h-full"
              />
              <span className={`absolute bottom-2 left-2 text-xs sm:text-sm backdrop-blur-sm rounded px-1.5 py-0.5
                ${idx === activeIndex ? "bg-orange-500 text-white" : "bg-black/60 text-white"}`}>
                {slide.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}