import express from "express";
import { createCase, getCase, updateCase } from "../controllers/caseController";
import { getAllCases } from "../controllers/caseController"; // Add new controller
import { verifyToken } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/roleMiddleware";

const router = express.Router();

router.post("/create", verifyToken, restrictTo("client"), createCase);
router.get("/:id", verifyToken, getCase);
router.put("/:id", verifyToken, restrictTo("lawyer"), updateCase);
router.get("/", verifyToken, getAllCases); // Use controller function

export default router;