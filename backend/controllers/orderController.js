import Order from "../models/Order.js";
import { getIO } from "../socket.js";
import { canChangeStatus } from "../utils/orderStatusRules.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";

// ==========================
// Create Order
// ==========================
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      products,
      totalPrice,
      paymentMethod,
      paymentProof,
      customerInfo,
    } = req.body;

    const order = await Order.create({
      owner: req.user?._id,
      user: req.user?._id,

      customerName,
      phone,
      address,

      customerInfo,

      products,

      totalPrice,

      paymentMethod,

      paymentProof,

      paymentStatus:
        paymentMethod === "cod"
          ? "pending"
          : "paid",

      status: "pending",
    });

    // SOCKET
    const io = getIO();

    if (io) {
      io.emit("orderCreated", order);

      io.emit("orderUpdated", {
        orderId: order._id,
        status: order.status,
      });

      io.emit("notification", {
        type: "success",
        message: "New Order Created 🛒",
      });
    }

    // Notification DB
    await Notification.create({
      message: `New order created`,
      type: "success",
    });

    // Audit Log
    await AuditLog.create({
      action: "ORDER_CREATED",
      performedBy: req.user?._id,
      targetId: order._id,
      metadata: {
        totalPrice,
        paymentMethod,
      },
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// User Orders
// ==========================
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Cancel Order
// ==========================
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // ownership check
    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const blockedStatuses = [
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      blockedStatuses.includes(order.status)
    ) {
      return res.status(400).json({
        message:
          "This order can no longer be cancelled",
      });
    }

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Cancellation reason required",
      });
    }

    order.status = "cancelled";

    order.cancelReason = reason;

    order.cancelledAt = new Date();

    await order.save();

    // SOCKET
    const io = getIO();

    if (io) {
      io.emit("orderUpdated", {
        orderId: order._id,
        status: order.status,
      });

      io.emit("notification", {
        message: `Order cancelled`,
        type: "warning",
      });
    }

    // Notification DB
    await Notification.create({
      message: `Order ${order._id} cancelled`,
      type: "warning",
    });

    // Audit Log
    await AuditLog.create({
      action: "ORDER_CANCELLED",
      performedBy: req.user._id,
      targetId: order._id,
      metadata: {
        reason,
      },
    });

    res.json({
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Admin Orders
// ==========================
export const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Update Status
// ==========================
export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // validation
    if (
      !canChangeStatus(order.status, status)
    ) {
      return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    const oldStatus = order.status;

    order.status = status;

    await order.save();

    // SOCKET
    const io = getIO();

    if (io) {
      io.emit("orderUpdated", {
        orderId: order._id,
        status: order.status,
      });

      io.emit("notification", {
        message: `Order updated to ${order.status}`,
        type: "info",
      });
    }

    // Notification DB
    await Notification.create({
      message: `Order ${order._id} changed to ${order.status}`,
      type: "info",
    });

    // Audit Log
    await AuditLog.create({
      action: "ORDER_STATUS_UPDATED",
      performedBy: req.user._id,
      targetId: order._id,
      metadata: {
        oldStatus,
        newStatus: status,
      },
    });

    res.json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};