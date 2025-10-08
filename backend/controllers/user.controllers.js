import mongoose from "mongoose";
import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import Item from "../models/item.model.js";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user is not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "user is not found" });
    }

    return res.status(200).json({ message: "location updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `update location user error ${error}` });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });
    const userRole = user.role;

    let stats = {};
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    if (userRole === "user") {
      // User Statistics with Aggregation Pipeline
      const userStats = await Order.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $facet: {
            // Total orders and basic stats
            basicStats: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalSpent: { $sum: "$totalAmount" },
                  avgOrderValue: { $avg: "$totalAmount" },
                },
              },
            ],

            // Completed vs pending orders
            orderStatus: [
              { $unwind: "$shopOrders" },
              {
                $group: {
                  _id: "$shopOrders.status",
                  count: { $sum: 1 },
                },
              },
            ],

            // Monthly spending trends (last 12 months)
            monthlySpending: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(
                      currentDate.getFullYear() - 1,
                      currentDate.getMonth(),
                      1
                    ),
                  },
                },
              },
              {
                $group: {
                  _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                  },
                  totalSpent: { $sum: "$totalAmount" },
                  orderCount: { $sum: 1 },
                },
              },
              { $sort: { "_id.year": 1, "_id.month": 1 } },
            ],

            // Favorite categories from order history
            categoryPreferences: [
              { $unwind: "$shopOrders" },
              { $unwind: "$shopOrders.shopOrderItems" },
              {
                $lookup: {
                  from: "items",
                  localField: "shopOrders.shopOrderItems.item",
                  foreignField: "_id",
                  as: "itemDetails",
                },
              },
              { $unwind: "$itemDetails" },
              {
                $group: {
                  _id: "$itemDetails.category",
                  orderCount: { $sum: "$shopOrders.shopOrderItems.quantity" },
                  totalSpent: {
                    $sum: {
                      $multiply: [
                        "$shopOrders.shopOrderItems.price",
                        "$shopOrders.shopOrderItems.quantity",
                      ],
                    },
                  },
                },
              },
              { $sort: { orderCount: -1 } },
              { $limit: 5 },
            ],
          },
        },
      ]);

      const basicStats = userStats[0].basicStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        avgOrderValue: 0,
      };
      const orderStatus = userStats[0].orderStatus;
      const monthlySpending = userStats[0].monthlySpending;
      const categoryPreferences = userStats[0].categoryPreferences;

      // Calculate completion rate
      const completedCount =
        orderStatus.find((s) => s._id === "delivered")?.count || 0;
      const completionRate =
        basicStats.totalOrders > 0
          ? Math.round((completedCount / basicStats.totalOrders) * 100)
          : 0;

      stats = {
        totalOrders: basicStats.totalOrders,
        completedOrders: completedCount,
        cancelledOrders: basicStats.totalOrders - completedCount,
        totalSpent: Math.round(basicStats.totalSpent || 0),
        avgOrderValue: Math.round(basicStats.avgOrderValue || 0),
        completionRate: completionRate,
        favoriteCategories: categoryPreferences
          .map((cat) => cat._id)
          .slice(0, 3),
        monthlySpending: monthlySpending.map((month) => ({
          month: `${month._id.year}-${month._id.month
            .toString()
            .padStart(2, "0")}`,
          amount: Math.round(month.totalSpent),
          orders: month.orderCount,
        })),
      };
    } else if (userRole === "owner") {
      // Owner Statistics with Shop Performance
      const shop = await Shop.findOne({ owner: userId });

      if (!shop) {
        return res
          .status(404)
          .json({ message: "Shop not found for this owner" });
      }

      const ownerStats = await Order.aggregate([
        { $unwind: "$shopOrders" },
        { $match: { "shopOrders.shop": shop._id } },
        {
          $facet: {
            // Revenue and order statistics
            revenueStats: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalRevenue: { $sum: "$shopOrders.subtotal" },
                  avgOrderValue: { $avg: "$shopOrders.subtotal" },
                },
              },
            ],

            // Order status distribution
            statusDistribution: [
              {
                $group: {
                  _id: "$shopOrders.status",
                  count: { $sum: 1 },
                },
              },
            ],

            // Monthly revenue trends
            monthlyRevenue: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(
                      currentDate.getFullYear() - 1,
                      currentDate.getMonth(),
                      1
                    ),
                  },
                },
              },
              {
                $group: {
                  _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                  },
                  revenue: { $sum: "$shopOrders.subtotal" },
                  orderCount: { $sum: 1 },
                },
              },
              { $sort: { "_id.year": 1, "_id.month": 1 } },
            ],

            // Top performing items
            topItems: [
              { $unwind: "$shopOrders.shopOrderItems" },
              {
                $group: {
                  _id: "$shopOrders.shopOrderItems.item",
                  itemName: { $first: "$shopOrders.shopOrderItems.name" },
                  totalQuantity: {
                    $sum: "$shopOrders.shopOrderItems.quantity",
                  },
                  totalRevenue: {
                    $sum: {
                      $multiply: [
                        "$shopOrders.shopOrderItems.price",
                        "$shopOrders.shopOrderItems.quantity",
                      ],
                    },
                  },
                },
              },
              { $sort: { totalQuantity: -1 } },
              { $limit: 10 },
            ],
          },
        },
      ]);

      // Get menu items count
      const menuItemsCount = await Item.countDocuments({ shop: shop._id });

      // Get shop rating from items
      const avgRatingData = await Item.aggregate([
        { $match: { shop: shop._id } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating.average" },
            totalRatings: { $sum: "$rating.count" },
          },
        },
      ]);

      const revenueStats = ownerStats[0].revenueStats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
      };
      const statusDistribution = ownerStats[0].statusDistribution;
      const monthlyRevenue = ownerStats[0].monthlyRevenue;
      const topItems = ownerStats[0].topItems;

      // Calculate completion rate
      const deliveredCount =
        statusDistribution.find((s) => s._id === "delivered")?.count || 0;
      const completionRate =
        revenueStats.totalOrders > 0
          ? Math.round((deliveredCount / revenueStats.totalOrders) * 100)
          : 0;

      stats = {
        menuItems: menuItemsCount,
        totalOrders: revenueStats.totalOrders,
        totalRevenue: Math.round(revenueStats.totalRevenue || 0),
        avgOrderValue: Math.round(revenueStats.avgOrderValue || 0),
        avgRating: avgRatingData[0]?.avgRating
          ? parseFloat(avgRatingData[0].avgRating.toFixed(1))
          : 0,
        totalRatings: avgRatingData[0]?.totalRatings || 0,
        completionRate: completionRate,
        monthlyRevenue: monthlyRevenue.map((month) => ({
          month: `${month._id.year}-${month._id.month
            .toString()
            .padStart(2, "0")}`,
          revenue: Math.round(month.revenue),
          orders: month.orderCount,
        })),
        topItems: topItems.slice(0, 5).map((item) => ({
          name: item.itemName,
          quantity: item.totalQuantity,
          revenue: Math.round(item.totalRevenue),
        })),
      };
    } else if (userRole === "deliveryBoy") {
      // Delivery Boy Statistics
      const deliveryStats = await Order.aggregate([
        { $unwind: "$shopOrders" },
        {
          $match: {
            "shopOrders.assignedDeliveryBoy": new mongoose.Types.ObjectId(
              userId
            ),
          },
        },
        {
          $facet: {
            // Basic delivery statistics
            basicStats: [
              {
                $group: {
                  _id: null,
                  totalDeliveries: { $sum: 1 },
                  completedDeliveries: {
                    $sum: {
                      $cond: [
                        { $eq: ["$shopOrders.status", "delivered"] },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
            ],

            // Status distribution
            statusDistribution: [
              {
                $group: {
                  _id: "$shopOrders.status",
                  count: { $sum: 1 },
                },
              },
            ],

            // Monthly delivery trends
            monthlyDeliveries: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(
                      currentDate.getFullYear() - 1,
                      currentDate.getMonth(),
                      1
                    ),
                  },
                },
              },
              {
                $group: {
                  _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                  },
                  deliveryCount: { $sum: 1 },
                  completedCount: {
                    $sum: {
                      $cond: [
                        { $eq: ["$shopOrders.status", "delivered"] },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
              { $sort: { "_id.year": 1, "_id.month": 1 } },
            ],

            // Average delivery time calculation (for completed deliveries)
            deliveryTimes: [
              {
                $match: {
                  "shopOrders.status": "delivered",
                  "shopOrders.deliveredAt": { $exists: true },
                },
              },
              {
                $group: {
                  _id: null,
                  avgDeliveryTime: {
                    $avg: {
                      $divide: [
                        {
                          $subtract: ["$shopOrders.deliveredAt", "$createdAt"],
                        },
                        1000 * 60, // Convert to minutes
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ]);

      const basicStats = deliveryStats[0].basicStats[0] || {
        totalDeliveries: 0,
        completedDeliveries: 0,
      };
      const statusDistribution = deliveryStats[0].statusDistribution;
      const monthlyDeliveries = deliveryStats[0].monthlyDeliveries;
      const deliveryTimes = deliveryStats[0].deliveryTimes[0] || {
        avgDeliveryTime: 0,
      };

      // Calculate earnings (assuming ₹40 per delivery)
      const earningsPerDelivery = 40;
      const totalEarnings =
        basicStats.completedDeliveries * earningsPerDelivery;

      // Calculate completion rate
      const completionRate =
        basicStats.totalDeliveries > 0
          ? Math.round(
              (basicStats.completedDeliveries / basicStats.totalDeliveries) *
                100
            )
          : 0;

      stats = {
        totalDeliveries: basicStats.totalDeliveries,
        completedDeliveries: basicStats.completedDeliveries,
        pendingDeliveries:
          basicStats.totalDeliveries - basicStats.completedDeliveries,
        avgDeliveryTime: Math.round(deliveryTimes.avgDeliveryTime || 25), // Default 25 minutes
        totalEarnings: totalEarnings,
        avgRating: 4.7, // This would come from a separate ratings collection
        completionRate: completionRate,
        monthlyEarnings: monthlyDeliveries.map((month) => ({
          month: `${month._id.year}-${month._id.month
            .toString()
            .padStart(2, "0")}`,
          earnings: month.completedCount * earningsPerDelivery,
          deliveries: month.deliveryCount,
        })),
      };
    } else if (userRole === "admin") {
      // Admin Statistics - Platform Overview
      const adminStats = await Promise.all([
        // Total users by role
        User.aggregate([
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
            },
          },
        ]),

        // Total orders and revenue
        Order.aggregate([
          {
            $facet: {
              orderStats: [
                {
                  $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                    avgOrderValue: { $avg: "$totalAmount" },
                  },
                },
              ],
              monthlyStats: [
                {
                  $match: {
                    createdAt: { $gte: startOfYear },
                  },
                },
                {
                  $group: {
                    _id: {
                      year: { $year: "$createdAt" },
                      month: { $month: "$createdAt" },
                    },
                    orders: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                  },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
              ],
            },
          },
        ]),

        // Shop statistics
        Shop.countDocuments(),
        Item.countDocuments(),

        // Active delivery assignments
        DeliveryAssignment.countDocuments({ status: "brodcasted" }),
      ]);

      const usersByRole = adminStats[0];
      const orderData = adminStats[1][0];
      const totalShops = adminStats[2];
      const totalItems = adminStats[3];
      const activeAssignments = adminStats[4];

      const orderStats = orderData.orderStats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
      };
      const monthlyStats = orderData.monthlyStats;

      stats = {
        totalUsers: usersByRole.reduce((sum, role) => sum + role.count, 0),
        usersByRole: usersByRole.reduce((acc, role) => {
          acc[role._id] = role.count;
          return acc;
        }, {}),
        totalShops: totalShops,
        totalItems: totalItems,
        totalOrders: orderStats.totalOrders,
        totalRevenue: Math.round(orderStats.totalRevenue || 0),
        avgOrderValue: Math.round(orderStats.avgOrderValue || 0),
        activeDeliveryAssignments: activeAssignments,
        monthlyOverview: monthlyStats.map((month) => ({
          month: `${month._id.year}-${month._id.month
            .toString()
            .padStart(2, "0")}`,
          orders: month.orders,
          revenue: Math.round(month.revenue),
        })),
      };
    }

    return res.status(200).json({
      success: true,
      role: userRole,
      stats: stats,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user stats",
      error: error.message,
    });
  }
};
