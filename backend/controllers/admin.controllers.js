import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";

// --- USER CRUD ---
export const listUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    const users = await User.find(filter).select("-password").lean();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "list users error " + error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "get user error " + error });
  }
};
// Create user
export const createUser = async (req, res) => {
  try {
    const { fullName, email, mobile, role, password, status } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName, email, mobile, role, status,
      password: hashedPassword
    });
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return res.status(201).json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: "create user error " + error });
  }
};

// Reset user password
export const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "reset password error " + error });
  }
};


export const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).select("-password").lean();
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "update user error " + error });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json({ message: "user deleted" });
  } catch (error) {
    return res.status(500).json({ message: "delete user error " + error });
  }
};

// --- SHOP CRUD ---
export const listShops = async (req, res) => {
  try {
    const shops = await Shop.find({}).populate("owner items").lean();
    return res.status(200).json(shops);
  } catch (error) {
    return res.status(500).json({ message: "list shops error " + error });
  }
};

export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate("owner items").lean();
    if (!shop) return res.status(404).json({ message: "shop not found" });
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: "get shop error " + error });
  }
};

// Create shop
export const createShop = async (req, res) => {
  try {
    const { name, city, state, address, owner, status } = req.body;
    let image = '';
    
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    
    const shop = await Shop.create({
      name, city, state, address, owner, image, status
    });
    
    await shop.populate('owner', 'fullName email mobile');
    await shop.populate('items');
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: "create shop error " + error });
  }
};

// Update shop
export const updateShopById = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = await uploadOnCloudinary(req.file.path);
    }
    
    const shop = await Shop.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).populate('owner', 'fullName email mobile').populate('items');
    
    if (!shop) return res.status(404).json({ message: "shop not found" });
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: "update shop error " + error });
  }
};


export const deleteShopById = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id).lean();
    if (!shop) return res.status(404).json({ message: "shop not found" });
    return res.status(200).json({ message: "shop deleted" });
  } catch (error) {
    return res.status(500).json({ message: "delete shop error " + error });
  }
};

// --- ITEM CRUD ---
export const listItems = async (req, res) => {
  try {
    const { shopId, category, foodType } = req.query;
    const filter = {};
    if (shopId) filter.shop = shopId;
    if (category) filter.category = category;
    if (foodType) filter.foodType = foodType;
    const items = await Item.find(filter).populate("shop").lean();
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: "list items error " + error });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("shop").lean();
    if (!item) return res.status(404).json({ message: "item not found" });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: "get item error " + error });
  }
};

// Create item
export const createItem = async (req, res) => {
  try {
    const { name, category, foodType, price, shop, status } = req.body;
    let image = '';
    
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    
    const item = await Item.create({
      name, category, foodType, price: Number(price), shop, image, status
    });
    
    await item.populate('shop', 'name');
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: "create item error " + error });
  }
};

// Update item
export const updateItemById = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = await uploadOnCloudinary(req.file.path);
    }
    
    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }
    
    const item = await Item.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).populate('shop', 'name');
    
    if (!item) return res.status(404).json({ message: "item not found" });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: "update item error " + error });
  }
};


export const deleteItemById = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "item not found" });
    return res.status(200).json({ message: "item deleted" });
  } catch (error) {
    return res.status(500).json({ message: "delete item error " + error });
  }
};

// --- DELIVERY BOY MANAGEMENT ---
export const listDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await User.find({ role: "deliveryBoy" }).select("-password").lean();
    return res.status(200).json(deliveryBoys);
  } catch (error) {
    return res.status(500).json({ message: "list delivery boys error " + error });
  }
};

// --- ORDERS ---
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "fullName email mobile")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
        select: "name image"
      })
      .populate({
        path: "shopOrders.shopOrderItems.item",
        model: "Item",
        select: "name image price"
      })
      .populate({
        path: "shopOrders.assignedDeliveryBoy",
        model: "User",
        select: "fullName mobile"
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "get all orders error " + error });
  }
};


// --- ANALYTICS ---
export const getAnalytics = async (req, res) => {
  try {
    const users = await User.countDocuments({ role: "user" });
    const owners = await User.countDocuments({ role: "owner" });
    const deliveryBoys = await User.countDocuments({ role: "deliveryBoy" });
    const admins = await User.countDocuments({ role: "admin" });
    const shops = await Shop.countDocuments({});
    const items = await Item.countDocuments({});
    const orders = await Order.countDocuments({});
    const deliveredOrders = await Order.countDocuments({ "shopOrders.status": "delivered" });

    return res.status(200).json({
      users, owners, deliveryBoys, admins, shops, items, orders, deliveredOrders
    });
  } catch (error) {
    return res.status(500).json({ message: "analytics error " + error });
  }
};
