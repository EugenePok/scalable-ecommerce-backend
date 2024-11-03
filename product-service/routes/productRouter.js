import express from "express";
import jwt from "jsonwebtoken";
import { Product } from "../models/products.js";
import "../config/dynamoose.js";

export const productRouter = express.Router();

//Add one product
productRouter.post("/", async (req, res) => {
  const { name, category, description, price, stockCount } = req.body;
  let product = {
    name: name,
    category: category,
    description: description,
    price: price,
    stockCount: stockCount,
  };
  var productInDB = await Product.create(product);
  res.status(201).json(productInDB);
});

//Get all Product
productRouter.get("/", async (req, res) => {
  var productsInDB = await Product.scan().exec();
  res.json(productsInDB);
});

//Get product
productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  var product = await Product.get({ id: id });
  if (!product) {
    return res.status(400).json({
      error: `No product with id ${id} found.`,
    });
  }
  res.json(product);
});

//Delete product
productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  var product = await Product.get({ id: id });
  if (!product) {
    return res.status(400).json({
      error: `No product with id ${id} found.`,
    });
  }
  await Product.delete({ id: id });
  res.json(product);
});

productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, stockCount } = req.body;
  var updateParam = {};
  if (name) updateParam["name"] = name;
  if (category) updateParam["category"] = category;
  if (description) updateParam["description"] = description;
  if (price) updateParam["price"] = price;
  if (stockCount) updateParam["stockCount"] = stockCount;
  if (!updateParam) {
    return res
      .status(400)
      .json({ error: "Bad request, no parameter supplied to update." });
  }
  var product = await Product.get({ id: id });
  if (!product) {
    return res.status(400).json({
      error: `No product with id ${id} found.`,
    });
  }
  var updatedProduct = await Product.update({ id: id }, updateParam);
  res.json(updatedProduct);
});
