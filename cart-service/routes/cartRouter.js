import express from "express";
import { Cart } from "../models/carts.js";
import axios from "axios";
import "../config/dynamoose.js";

export const productRouter = express.Router();

const PRODUCT_SERVICE_URI =
  process.env.PRODUCT_SERVICE_URI || "http://localhost:5002";

//Add one product
productRouter.post("/", async (req, res) => {
  const { email, productId, quantity } = req.body;
  if (!email || !productId || quantity === null)
    return res.status(400).json({
      error: `Please provide email, productId and quantity correctly.`,
    });

  const productResponse = await axios.get(
    `${PRODUCT_SERVICE_URI}/api/products/${productId}`
  );
  if (!productResponse.data) {
    return res.status(404).json({ msg: "Product not found" });
  }

  const params = {
    productId: productId,
    quantity: quantity ?? 1,
  };
  var cart = await Cart.get({ email: email });
  if (!cart) {
    cart = { email: email, items: [params] };
    var cartInDB = await Cart.create(cart);
    res.status(201).json(cartInDB);
  } else {
    var existingProduct = cart.items.find((x) => x.productId == productId);
    if (existingProduct) existingProduct.quantity += quantity;
    else cart.items.push(params);
    var cartInDB = await Cart.update({ email: email }, { items: cart.items });
    res.status(201).json(cartInDB);
  }
});

productRouter.get("/:email", async (req, res) => {
  const { email } = req.params;
  if (!email)
    return res.status(400).json({
      error: `Please provide email.`,
    });
  return res.json(await Cart.get({ email: email }));
});

productRouter.delete("/:email", async (req, res) => {
  const { email } = req.params;
  if (!email)
    return res.status(400).json({
      error: `Please provide email.`,
    });
  var cart = await Cart.get({ email: email });
  if (!cart)
    return res
      .status(400)
      .json({ error: `No cart with email ${email} found.` });
  return res.json(await Cart.delete({ email: email }));
});

productRouter.put("/", async (req, res) => {
  const { email, productId, quantity } = req.body;
  if (!email || !productId || quantity === null)
    return res.status(400).json({
      error: `Please provide email, productId and quantity correctly.`,
    });
  var cart = await Cart.get({ email: email });
  if (!cart) {
    return res
      .status(400)
      .json({ error: `No cart with email ${email} found.` });
  } else if (quantity == 0) {
    cart.items = cart.items.find((x) => x != existingProduct);
  } else {
    var existingProduct = cart.items.find((x) => x.productId == productId);
    if (existingProduct) {
      if (quantity != 0) existingProduct.quantity = quantity;
    } else {
      cart.items.push({
        productId: productId,
        quantity: quantity,
      });
    }
  }
  var cartInDB = await Cart.update({ email: email }, { items: cart.items });
  res.json(cartInDB);
});
