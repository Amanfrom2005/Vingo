import React from 'react';
import Profile from '../components/Profile';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Profile fullView={true} />
    </div>
  );
};

export default ProfilePage;
