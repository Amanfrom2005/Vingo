import React from 'react';
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function OrderPlaced() {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden"
      aria-live="polite"
      aria-label="Order placed confirmation"
      tabIndex={-1}
    >
      <FaCircleCheck className="text-green-500 text-6xl mb-4" aria-hidden="true" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2" tabIndex={0}>Order Placed!</h1>
      <p className="text-gray-600 max-w-md mb-6" tabIndex={0}>
        Thank you for your purchase. Your order is being prepared. You can track your order status in the "My Orders" section.
      </p>
      <button
        type="button"
        onClick={() => navigate("/my-orders")}
        className="bg-[#ff9d5d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg text-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f87171]"
        aria-label="Back to my orders"
      >
        Back to my orders
      </button>
    </main>
  );
}

export default OrderPlaced;
