// frontend/src/App.jsx
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// All your page and hook imports
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheckOut";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";
import ProfilePage from "./pages/ProfilePage";
import FAQ from "./pages/FAQ";
import PrivacyPage from "./pages/PrivacyPage";
import License from "./pages/License";
import Help from "./pages/Help";

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useUpdateLocation from "./hooks/useUpdateLocation";
import useGetCity from "./hooks/useGetCity";
import useGetMyshop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useCartSync from "./hooks/useCartSync";

import AdminLayout from "./admin/AdminLayout";
import AdminHome from "./admin/pages/AdminHome";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminShops from "./admin/pages/AdminShops";
import AdminItems from "./admin/pages/AdminItems";
import AdminOrders from "./admin/pages/AdminOrders";
import RequireAdmin from "./components/RequireAdmin";
import UserSpecificHooks from "./components/UserSpecificHooks";
import ContactPage from "./pages/ContactPage";
import AboutUSPage from "./pages/AboutUSPage";

export const serverUrl = "http://localhost:8000";

function App() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useGetCurrentUser();
  useUpdateLocation();
  useGetCity();
  useGetMyshop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();
  useCartSync();

  useEffect(() => {
    if (userData) {
      dispatch({ type: "socket/connect" });
    }
    return () => {
      if (userData) {
        dispatch({ type: "socket/disconnect" });
      }
    };
  }, [userData, dispatch]);

  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/profile"
        element={userData ? <ProfilePage /> : <Navigate to="/signin" />}
      />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/privacy-policy" element={<PrivacyPage />} />
      <Route path="/license" element={<License />} />
      <Route path="/help" element={<Help />} />
      <Route path="/about" element={<AboutUSPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/"
        element={
          userData ? (
            userData.role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Home />
            )
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/add-item"
        element={userData ? <AddItem /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/edit-item/:itemId"
        element={userData ? <EditItem /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/cart"
        element={userData ? <CartPage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/checkout"
        element={userData ? <CheckOut /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/order-placed"
        element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/my-orders"
        element={userData ? <MyOrders /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/track-order/:orderId"
        element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/shop/:shopId"
        element={userData ? <Shop /> : <Navigate to={"/signin"} />}
      />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="items" element={<AdminItems />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
}

export default App;
