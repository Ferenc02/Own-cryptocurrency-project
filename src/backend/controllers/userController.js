import mongoose from "mongoose";
import {
  hashPassword,
  validatePassword,
} from "../auth/user_authentication.mjs";
import User from "../auth/user_schema.js";

export const authenticate = async (req, res) => {
  const { username, password, email } = req.body;

  console.log(email, username, password);
  if (email) {
    register(req, res);
  } else if (username && password) {
    login(req, res);
  } else {
    return res.status(400).json({ message: "Invalid request" });
  }
};

export const register = async (req, res) => {
  let { username, password, email, id } = req.body;

  const hashedPassword = await hashPassword(password);

  id = id || new mongoose.Types.ObjectId().toString();

  console.log("registering user:");

  if (existingUser.length > 0) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    id,
  });
  res.status(201).json({ message: "User registered" });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  let user = await User.find({ username });
  if (user.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  user = user[0];

  const isMatch = await validatePassword(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }
  res.status(200).json({
    message: "Login successful",
    user: { username: user.username, email: user.email, id: user.id },
  });
};
