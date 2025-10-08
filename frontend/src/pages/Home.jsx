import React from 'react';
import { useSelector } from 'react-redux';
import UserDashboard from '../components/UserDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
import DeliveryBoy from '../components/DeliveryBoy';
import { ClipLoader } from 'react-spinners';
import Footer from '../components/Footer';

function Home() {
  const { userData } = useSelector(state => state.user);

  if (!userData) {
    // Optionally, show a loading state or redirect to login if no user data
    return (
      <div 
        role="alert" 
        aria-live="assertive" 
        className="w-full min-h-screen flex items-center justify-center"
      >
       <ClipLoader size={20} color="#ff4d2d" /> Loading...
      </div>
    );
  }

  return (
    <main 
      className="w-full min-h-screen pt-[100px] flex flex-col items-center bg-[#fff9f6]" 
      aria-label="Dashboard"
    >
      {userData.role === "user" && <UserDashboard />}
      {userData.role === "owner" && <OwnerDashboard />}
      {userData.role === "deliveryBoy" && <DeliveryBoy />}
      <Footer />
    </main>
  );
}

export default Home;
