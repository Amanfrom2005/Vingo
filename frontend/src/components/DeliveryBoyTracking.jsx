import React from 'react';
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';

// Custom icon for delivery boy (scooter)
const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40], // Position popup above icon
  shadowUrl: null,
});

// Custom icon for customer (home)
const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: null,
});

function DeliveryBoyTracking({ data }) {
  const deliveryBoyLat = data.deliveryBoyLocation?.lat ?? 0;
  const deliveryBoyLon = data.deliveryBoyLocation?.lon ?? 0;
  const customerLat = data.customerLocation?.lat ?? 0;
  const customerLon = data.customerLocation?.lon ?? 0;

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  // Calculate center with slight offset to fit both markers if needed
  // Simple average here, could be improved with bounds later
  const center = [
    (deliveryBoyLat + customerLat) / 2,
    (deliveryBoyLon + customerLon) / 2,
  ];

  return (
    <div
      className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md"
      role="region"
      aria-label="Live delivery tracking map"
    >
      <MapContainer
        className="w-full h-full"
        center={center}
        zoom={16}
        scrollWheelZoom={false}
        keyboard={true}
        aria-live="polite"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
          <Popup>Delivery Boy Location</Popup>
        </Marker>
        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup>Customer Location</Popup>
        </Marker>
        <Polyline positions={path} color="#2563EB" weight={4} />
      </MapContainer>
    </div>
  );
}

export default DeliveryBoyTracking;
