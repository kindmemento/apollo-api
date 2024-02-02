import express from "express";
import { addIndex, deleteIndex } from "../controllers/indexController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// Index routes
router.post("/addIndex", authenticateUser, addIndex);
router.delete("/deleteIndex/:indexId", authenticateUser, deleteIndex);

export default router;
