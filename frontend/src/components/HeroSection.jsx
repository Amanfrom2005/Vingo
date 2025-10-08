import React, { useEffect, useState } from 'react';
import { 
  FaYoutube, 
  FaInstagram, 
  FaFacebookF, 
  FaLinkedinIn,
  FaStar 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen lg:min-h-0">
          
          {/* Left Content */}
          <div className={`space-y-6 lg:space-y-8 text-center lg:text-left transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Brand Name */}
            <div className="space-y-4 flex items-stretch gap-4 justify-center lg:justify-start">
              <h1 className="text-5xl lg:text-7xl flex items-baseline-last font-bold m-0 text-orange-500">
                VINGO
              </h1>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Food
                <span className="block text-gray-600 text-2xl lg:text-4xl font-semibold">
                  Delivery
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base lg:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              Experience lightning-fast food delivery with Vingo. From local favorites to 
              international cuisines, we bring the best flavors right to your doorstep 
              with just a few taps.
            </p>

            {/* Additional Features */}
            <div className="space-y-3">
              <p className="text-gray-700 text-sm lg:text-base">
                🚀 <span className="font-medium">Quick Delivery</span> - Average delivery time under 30 minutes
              </p>
              <p className="text-gray-700 text-sm lg:text-base">
                🍔 <span className="font-medium">Wide Selection</span> - Over 500+ restaurants and cuisines
              </p>
              <p className="text-gray-700 text-sm lg:text-base">
                💳 <span className="font-medium">Easy Payment</span> - secure payment options with Razorpay
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link 
              to={""}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Explore Now
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center lg:justify-start space-x-6 pt-6">
              <div className="flex space-x-4">
                <a href="#" className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <FaYoutube size={20} />
                </a>
                <a href="#" className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <FaLinkedinIn size={20} />
                </a>
              </div>
            </div>

            {/* Rating */}
            <div className={`flex items-center justify-center lg:justify-start space-x-2 pt-4 transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="animate-pulse" style={{animationDelay: `${i * 100}ms`}} />
                ))}
              </div>
              <span className="text-gray-600 font-medium">5 star rating</span>
            </div>
            <p className="text-gray-500 text-sm">based on 1786 reviews</p>
          </div>

          {/* Right Content - Food Images */}
          <div className={`relative transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            
            {/* Main Food Circle - Hidden on mobile as requested */}
            <div className=" md:block relative">
              <img 
                src="/heroSection/17372.png" 
                alt="Delicious Food Collection" 
                className="w-full max-w-lg mx-auto hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating Food Items */}
            <div className="hidden md:block md:absolute md:inset-0">
              
              {/* Food Item 1 - Top Left */}
              <div className="absolute top-4 left-4 transform hover:scale-110 transition-transform duration-300">
                <img 
                  src="/heroSection/food1.png" 
                  alt="Pizza" 
                  className="w-20 h-20 rounded-full shadow-lg animate-float"
                />
              </div>

              {/* Food Item 2 - Top Right */}
              <div className="absolute top-8 right-8 transform hover:scale-110 transition-transform duration-300">
                <img 
                  src="/heroSection/food2.png" 
                  alt="Burger" 
                  className="w-20 h-20 rounded-full shadow-lg animate-float animation-delay-1000"
                />
              </div>

              {/* Food Item 3 - Bottom Left */}
              <div className="absolute bottom-12 left-8 transform hover:scale-110 transition-transform duration-300">
                <img 
                  src="/heroSection/food3.png" 
                  alt="Fries" 
                  className="w-20 h-20 rounded-full shadow-lg animate-float animation-delay-2000"
                />
              </div>

              {/* Food Item 4 - Bottom Right */}
              <div className="absolute bottom-4 right-4 transform hover:scale-110 transition-transform duration-300">
                <img 
                  src="/heroSection/food4.png" 
                  alt="Drink" 
                  className="w-20 h-20 rounded-full shadow-lg animate-float animation-delay-3000"
                />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-96 h-96 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Badges */}
      <div className={`absolute top-20 right-8 space-y-4 hidden lg:block transition-all duration-1000 delay-700 ${
        isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}>
        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12 animate-bounce">
          Best Food 😋
        </div>
        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold transform -rotate-12 animate-bounce animation-delay-1000">
          Best in Town ♨️
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
