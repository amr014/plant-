import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerInfo: {
      fullName: String,
      phone: String,
      address: String,
    },

    products: [
      {
        productId: String,
        name: String,
        price: Number,
        qty: Number,
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: [
        "cod",
        "instapay",
        "vodafone_cash",
        "orange_cash",
        "visa",
      ],
      default: "cod",
    },

    paymentProof: {
      type: String,
      default: null,
    },

    cancelReason: {
  type: String,
},

cancelledAt: {
  type: Date,
},

owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
  },
  { timestamps: true }
);

export default mongoose.model(
  "Order",
  orderSchema
);