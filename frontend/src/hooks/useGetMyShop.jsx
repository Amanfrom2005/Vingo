import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function useGetMyshop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return; // Prevent fetch if user data not loaded

    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my`, { withCredentials: true });
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.error('Error fetching my shop:', error);
      }
    };

    fetchShop();
  }, [userData, dispatch]);
}

export default useGetMyshop;
