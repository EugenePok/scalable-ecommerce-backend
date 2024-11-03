import dynamoose from "dynamoose";
import "../config/dynamoose.js";
import { v4 as uuidv4 } from "uuid";

const productSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => uuidv4(),
      hashKey: true,
    },
    name: {
      type: String,
      required: true,
      get: (value) => value.trim().toLowerCase(),
      set: (newValue, oldValue) => {
        if (oldValue == newValue) return oldValue;
        return newValue.trim().toLowerCase();
      },
    },
    category: {
      type: String,
      required: true,
      index: {
        name: "categoryIndex",
        type: "global",
      },
      get: (value) => value.trim().toLowerCase(),
      set: (newValue, oldValue) => {
        if (oldValue == newValue) return oldValue;
        return newValue.trim().toLowerCase();
      },
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stockCount: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: ["createDate", "creation"],
      updatedAt: ["updateDate", "updated"],
    },
  }
);

export const Product = dynamoose.model("Product", productSchema, {
  create: true,
  waitForActive: true,
});
