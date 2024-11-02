import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
import * as argon2 from "argon2";
import "../config/dynamoose.js";

export const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    var existedUser = await User.get(email);
    if (existedUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    let user = {
      email: email,
      name: name,
      password: password,
    };
    await User.create(user);
    const token = jwt.sign({ userId: user.email }, process.env.JWTSECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.get(email);
    if (!user) {
      return res
        .status(400)
        .json({ error: `No user with email ${email} exists.` });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user.email }, process.env.JWTSECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
