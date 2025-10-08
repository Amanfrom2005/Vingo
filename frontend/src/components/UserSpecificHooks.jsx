import useGetCity from "../hooks/useGetCity";
import useGetMyshop from "../hooks/useGetMyShop";
import useGetShopByCity from "../hooks/useGetShopByCity";
import useGetItemsByCity from "../hooks/useGetItemsByCity";
import useGetMyOrders from "../hooks/useGetMyOrders";
import { useSelector } from "react-redux";

const UserSpecificHooks = () => {
  const { userData } = useSelector((state) => state.user);

  // These hooks are for all non-admin users
  useGetCity();
  useGetItemsByCity();
  useGetMyOrders();
  useGetShopByCity();

  // This hook is specifically for owners
  if (userData && userData.role === 'owner') {
    useGetMyshop();
  }

  return null;
};

export default UserSpecificHooks;
