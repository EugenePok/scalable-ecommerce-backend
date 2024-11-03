import dynamoose from "dynamoose";
import "../config/dynamoose.js";

const cartItemSchema = new dynamoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: { type: Number, default: 1, required: true },
});

const cartSchema = new dynamoose.Schema({
  email: {
    type: String,
    required: true,
    hashKey: true,
    get: (value) => value.trim().toLowerCase(),
    set: (newValue, oldValue) => {
      if (oldValue == newValue) return oldValue;
      return newValue.trim().toLowerCase();
    },
  },
  items: {
    type: Array,
    schema: [cartItemSchema],
  },
});

export const Cart = dynamoose.model("Cart", cartSchema, {
  create: true,
  waitForActive: true,
});
