import express from "express";
import {
  getCurrentUser,
  getUserStats,
  updateUserLocation,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update-location", isAuth, updateUserLocation);
userRouter.get("/stats", isAuth, getUserStats);

// Cart routes
userRouter.get("/cart", isAuth, getCart);
userRouter.post("/cart", isAuth, addToCart);
userRouter.put("/cart", isAuth, updateCartItem);
userRouter.delete("/cart/:id", isAuth, removeFromCart);
userRouter.delete("/cart-clear", isAuth, clearCart);

export default userRouter;
