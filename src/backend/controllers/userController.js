import mongoose from "mongoose";
import {
  hashPassword,
  validatePassword,
} from "../auth/user_authentication.mjs";
import User from "../auth/user_schema.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const authenticate = async (req, res) => {
  const { username, password, email } = req.body;

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

  let existingUser = await User.find({ username });
  if (existingUser.length > 0) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const token = jwt.sign(
    {
      id,
      username,
      email,
      role: "user",
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    id,
    role: "user",
  });
  res
    .status(201)
    .json({
      message: "User registered",
      token,
      user: { username: user.username, email: user.email, id: user.id },
    });
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

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role || "user",
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: { username: user.username, email: user.email, id: user.id },
  });
};
