import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        dispatch(setLocation({ lat: latitude, lon: longitude }));

        try {
          const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
          );

          const result = response?.data?.results?.[0];

          if (result) {
            dispatch(
              setCurrentCity(result.city || result.county || 'Unknown City')
            );
            dispatch(setCurrentState(result.state || 'Unknown State'));
            dispatch(
              setCurrentAddress(
                result.address_line2 || result.address_line1 || 'Unknown Address'
              )
            );
            dispatch(setAddress(result.address_line2 || result.address_line1 || ''));
          } else {
            console.error('No geocoding results found.');
          }
        } catch (error) {
          console.error('Error fetching reverse geocoding:', error);
        }
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      },
      { enableHighAccuracy: true }
    );
  }, [dispatch, userData, apiKey]);
}

export default useGetCity;
