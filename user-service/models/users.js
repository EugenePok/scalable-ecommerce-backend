import dynamoose from "dynamoose";
import * as argon2 from "argon2";
import "../config/dynamoose.js";

const userSchema = new dynamoose.Schema({
  email: { type: String, required: true, hashKey: true },
  name: { type: String, required: true },
  password: {
    type: String,
    set: async (newValue, oldValue) => {
      if (oldValue == newValue) return oldValue;
      return await argon2.hash(newValue);
    },
    required: true,
  },
});

export const User = dynamoose.model("User", userSchema, {
  create: true,
  waitForActive: true,
});
