import express from "express";
import {
  listBlocks,
  createNewBlock,
  getBlockByIndex,
} from "../controllers/blockController.js";

const router = express.Router();
router.get("/", listBlocks);
router.post("/", createNewBlock);

router.get("/:index", getBlockByIndex);

export default router;
