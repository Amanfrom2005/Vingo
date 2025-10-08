import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setCartItems } from '../redux/userSlice';

/**
 * Custom hook to sync cart with database
 * Fetches cart from server when user logs in
 */
const useCartSync = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCart = async () => {
      if (userData && userData.role === 'user') {
        try {
          const response = await axios.get(`${serverUrl}/api/user/cart`, {
            withCredentials: true,
          });
          
          // Update Redux state with cart from database
          if (response.data && Array.isArray(response.data)) {
            dispatch(setCartItems(response.data));
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      }
    };

    fetchCart();
  }, [userData?._id, dispatch]); // Only run when user ID changes

  return null;
};

export default useCartSync;
