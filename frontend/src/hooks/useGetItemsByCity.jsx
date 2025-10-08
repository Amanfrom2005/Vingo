import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setItemsInMyCity } from '../redux/userSlice';

function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentCity) return; // Exit if city not set yet

    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${encodeURIComponent(currentCity)}`,
          { withCredentials: true }
        );
        dispatch(setItemsInMyCity(result.data));
        console.log('Items fetched by city:', result.data);
      } catch (error) {
        console.error('Error fetching items by city:', error);
      }
    };

    fetchItems();
  }, [currentCity, dispatch]);
}

export default useGetItemsByCity;
