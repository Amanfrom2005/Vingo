import User from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    // Requires isAuth to set req.userId first
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "isAdmin error" });
  }
};

export default isAdmin;