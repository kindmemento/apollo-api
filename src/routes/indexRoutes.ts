import express from "express";
import { addIndex } from "../controllers/indexController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// Index routes
router.post("/addIndex", authenticateUser, addIndex);

export default router;
