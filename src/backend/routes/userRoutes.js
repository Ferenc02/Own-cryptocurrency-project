import express from "express";
import { authenticate } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", (req, res) => {
  res.status(200).json({ message: "List of users" });
});
router.post("/users", authenticate);

export default router;
