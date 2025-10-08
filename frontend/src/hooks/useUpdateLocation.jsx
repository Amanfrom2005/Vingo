import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App';
import { useSelector } from 'react-redux';

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return; // Prevent running if no user data

    const updateLocation = async (lat, lon) => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );
        console.log('Location updated:', result.data);
      } catch (error) {
        console.error('Failed to update location:', error);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => updateLocation(pos.coords.latitude, pos.coords.longitude),
      (err) => console.error('Geolocation watch error:', err),
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [userData]);

}

export default useUpdateLocation;
