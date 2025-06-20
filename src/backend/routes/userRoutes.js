import express from "express";
import { authenticate } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", (req, res) => {
  res.status(200).json({ message: "List of users" });
});
router.post("/users", authenticate);
router.post("/token", verifyToken);

export default router;
