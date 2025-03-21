import { Request, Response, NextFunction } from "express";
import Case from "../models/Case";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf" && ext !== ".doc" && ext !== ".docx") {
      return cb(new Error("Only PDF and Word files are allowed"));
    }
    cb(null, true);
  },
}).single("file");

export const uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ success: false, error: err.message });
      return;
    }

    const { caseId } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, error: "No file uploaded" });
      return;
    }

    try {
      const caseData = await Case.findById(caseId);
      if (!caseData) {
        res.status(404).json({ success: false, error: "Case not found" });
        return;
      }

      const document = {
        fileName: file.originalname,
        path: file.path,
      };

      caseData.documents.push(document);
      await caseData.save();

      res.status(200).json({ success: true, data: document });
    } catch (error) {
      next(error);
    }
  });
};