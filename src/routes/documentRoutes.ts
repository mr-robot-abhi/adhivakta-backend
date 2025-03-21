import express from "express";
import { uploadDocument } from "../controllers/documentController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/upload", verifyToken, uploadDocument);

export default router;