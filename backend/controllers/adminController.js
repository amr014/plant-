import Order from "../models/Order.js";
import User from "../models/User.js";

// Dashboard Analytics
export const getDashboardStats = async (
  req,
  res
) => {
  try {

    // =========================
    // COUNTS
    // =========================
    const totalOrders =
      await Order.countDocuments();

    const totalUsers =
      await User.countDocuments();

    const deliveredOrders =
      await Order.countDocuments({
        status: "delivered",
      });

    // =========================
    // REVENUE
    // =========================
    const revenueData =
      await Order.aggregate([
        {
          $match: {
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalPrice",
            },
          },
        },
      ]);

    const revenue =
      revenueData[0]?.totalRevenue || 0;

    // =========================
    // AVG ORDER VALUE
    // =========================
    const avgOrderData =
      await Order.aggregate([
        {
          $group: {
            _id: null,
            avg: {
              $avg: "$totalPrice",
            },
          },
        },
      ]);

    const avgOrderValue =
      avgOrderData[0]?.avg || 0;

    // =========================
    // CONVERSION RATE
    // =========================
    const conversionRate =
      totalOrders === 0
        ? 0
        : (
            (deliveredOrders /
              totalOrders) *
            100
          ).toFixed(1);

    // =========================
    // RESPONSE
    // =========================
    res.json({
      totalOrders,
      totalUsers,
      deliveredOrders,
      revenue,
      avgOrderValue,
      conversionRate,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};