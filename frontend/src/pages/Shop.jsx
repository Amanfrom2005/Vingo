import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { serverUrl } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStore, FaLocationDot, FaUtensils, FaArrowLeft } from "react-icons/fa6";
import FoodCard from '../components/FoodCard';

function Shop() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true });
      setShop(result.data.shop);
      setItems(result.data.items);
    } catch (error) {
      console.error('Failed to fetch shop data:', error);
    }
  };

  useEffect(() => {
    if (shopId) {
      handleShop();
    }
  }, [shopId]);

  return (
    <main className="min-h-screen bg-gray-50" aria-label={`Shop details for ${shop?.name || 'Shop'}`}>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        aria-label="Go back to home"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {shop && (
        <section className="relative w-full h-64 md:h-80 lg:h-96" aria-label="Shop header">
          <img
            src={shop.image}
            alt={`Image of ${shop.name}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4">
            <FaStore className="text-white text-4xl mb-3 drop-shadow-md" aria-hidden="true" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg" tabIndex={0}>
              {shop.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <FaLocationDot size={22} color="red" aria-hidden="true" />
              <p className="text-lg font-medium text-gray-200" tabIndex={0}>
                {shop.address}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 py-10" aria-label="Shop menu">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800" tabIndex={0}>
          <FaUtensils color="red" aria-hidden="true" /> Our Menu
        </h2>

        {items.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8" role="list">
            {items.map((item) => (
              <FoodCard key={item._id} data={item} role="listitem" />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg" role="alert" aria-live="polite">
            No Items Available
          </p>
        )}
      </section>
    </main>
  );
}

export default Shop;
