import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking';
import { useSelector } from 'react-redux';
import { serverUrl } from '../App';

function TrackOrderPage() {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const { socket } = useSelector(state => state.user);
  const [liveLocations, setLiveLocations] = useState({});
  const navigate = useNavigate();

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true });
      setCurrentOrder(result.data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const updateHandler = ({ deliveryBoyId, latitude, longitude }) => {
      setLiveLocations((prev) => ({
        ...prev,
        [deliveryBoyId]: { lat: latitude, lon: longitude },
      }));
    };

    socket.on('updateDeliveryLocation', updateHandler);

    return () => {
      socket.off('updateDeliveryLocation', updateHandler);
    };
  }, [socket]);

  useEffect(() => {
    if (orderId) {
      handleGetOrder();
    }
  }, [orderId]);

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-6" aria-label="Track order page">
      <header 
        className="relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px]"
        role="banner"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go back"
          className="text-[#ff4d2d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4d2d] rounded"
        >
          <IoIosArrowRoundBack size={35} />
        </button>
        <h1 className="text-2xl font-bold md:text-center" tabIndex={0}>Track Order</h1>
      </header>

      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <section
          key={shopOrder._id || index}
          className="bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4"
          aria-label={`Order section for ${shopOrder.shop.name}`}
          tabIndex={0}
        >
          <div>
            <p className="text-lg font-bold mb-2 text-[#ff4d2d]">{shopOrder.shop.name}</p>
            <p className="font-semibold" aria-label="Items">
              <span>Items:</span> {shopOrder.shopOrderItems?.map(i => i.name).join(", ")}
            </p>
            <p>
              <span className="font-semibold">Subtotal:</span> ₹{shopOrder.subtotal}
            </p>
            <p className="mt-6">
              <span className="font-semibold">Delivery address:</span> {currentOrder.deliveryAddress?.text}
            </p>
          </div>

          {shopOrder.status !== "delivered" ? (
            shopOrder.assignedDeliveryBoy ? (
              <div className="text-sm text-gray-700" aria-label="Delivery boy contact info">
                <p className="font-semibold">
                  <span>Delivery Boy Name:</span> {shopOrder.assignedDeliveryBoy.fullName}
                </p>
                <p className="font-semibold">
                  <span>Delivery Boy contact No.:</span> {shopOrder.assignedDeliveryBoy.mobile}
                </p>
              </div>
            ) : (
              <p className="font-semibold">Delivery Boy is not assigned yet.</p>
            )
          ) : (
            <p className="text-green-600 font-semibold text-lg" aria-live="polite">Delivered</p>
          )}

          {shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered" && (
            <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md" aria-label="Delivery tracking map">
              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation:
                    liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                      lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                      lon: shopOrder.assignedDeliveryBoy.location.coordinates[0],
                    },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude,
                  },
                }}
              />
            </div>
          )}
        </section>
      ))}
    </main>
  );
}

export default TrackOrderPage;
