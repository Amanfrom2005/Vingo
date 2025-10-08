import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice';

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentCity) return; // Avoid fetching if city is not set

    const fetchShops = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${encodeURIComponent(currentCity)}`,
          { withCredentials: true }
        );
        dispatch(setShopsInMyCity(result.data));
        console.log('Shops fetched by city:', result.data);
      } catch (error) {
        console.error('Error fetching shops by city:', error);
      }
    };

    fetchShops();
  }, [currentCity, dispatch]);
}

export default useGetShopByCity;
