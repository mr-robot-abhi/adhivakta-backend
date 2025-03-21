import express from "express";
import { sendNotification } from "../controllers/notificationController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/send", verifyToken, sendNotification);

export default router;