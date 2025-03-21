import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";
import authRoutes from "./routes/authRoutes";
import caseRoutes from "./routes/caseRoutes";
import documentRoutes from "./routes/documentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { verifyToken } from "./middleware/authMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use(helmet());
app.use(cors({ origin: ["http://localhost:3000", "exp://localhost:19000"] }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string, { dbName: "adhivakta" })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/auth", authRoutes);
app.use("/cases", caseRoutes);
app.use("/documents", documentRoutes);
app.use("/notifications", notificationRoutes);

// Fallback /cases
app.get("/cases", verifyToken, (req, res) => {
  console.log("Fallback GET /cases hit - User:", (req as any).user);
  const mockCases = [
    {
      _id: "2",
      caseName: "Fallback Case",
      caseNumber: "456/2025",
      caseDate: "2025-03-20",
      courtType: "District Court",
      status: "Active",
      documents: [],
      advocateOnRecord: { name: "Jane Doe", email: "jane@example.com" },
    },
  ];
  res.json({ success: true, data: mockCases });
});

app.get("/", (req, res) => {
  res.send(`Adhivakta Backend Running on port ${PORT}`);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});