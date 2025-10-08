import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
import { upload } from "../middlewares/multer.js";
import {
  listUsers, getUserById, updateUserById, deleteUserById,
  listShops, getShopById, updateShopById, deleteShopById,
  listItems, getItemById, updateItemById, deleteItemById,
  listDeliveryBoys, getAnalytics,
  getAllOrders,
  createItem,
  createShop,
  createUser,
  resetUserPassword
} from "../controllers/admin.controllers.js";

const router = express.Router();

// All admin routes are protected
router.use(isAuth, isAdmin);

// --- Users ---
router.get("/users", listUsers);                // /api/admin/users?role=
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);
router.post("/users", createUser);
router.put("/users/:id/reset-password", resetUserPassword);

// --- Shops ---
router.get("/shops", listShops);
router.get("/shops/:id", getShopById);
router.post("/shops", upload.single("image"), createShop);
router.put("/shops/:id", upload.single("image"), updateShopById);
router.delete("/shops/:id", deleteShopById);

// --- Items ---
router.get("/items", listItems);                // /api/admin/items?shopId=
router.get("/items/:id", getItemById);
router.delete("/items/:id", deleteItemById);
router.post("/items", upload.single("image"), createItem);
router.put("/items/:id", upload.single("image"), updateItemById);

// --- Delivery Boys ---
router.get("/delivery-boys", listDeliveryBoys);

// --- Orders ---
router.get("/orders", getAllOrders);

// --- Dashboard Analytics ---
router.get("/analytics", getAnalytics);

export default router;
