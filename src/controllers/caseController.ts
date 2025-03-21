import { Request, Response } from "express";

// Mock Case type (replace with your real model if using Mongoose)
interface Case {
  _id: string;
  caseName: string;
  caseNumber: string;
  caseDate: string;
  courtType: string;
  status: string;
  documents: { fileName: string; path: string }[];
  advocateOnRecord: { name: string; email: string };
}

export const getAllCases = async (req: Request, res: Response) => {
  try {
    console.log("getAllCases called - User:", req.user); // Log authenticated user
    // Mock data for now—replace with real DB query later
    const cases: Case[] = [
      {
        _id: "1",
        caseName: "Test Case",
        caseNumber: "123/2025",
        caseDate: "2025-03-19",
        courtType: "High Court",
        status: "Pending",
        documents: [],
        advocateOnRecord: { name: "John Doe", email: "john@example.com" },
      },
    ];
    res.status(200).json({ success: true, data: cases });
  } catch (error) {
    console.error("Error in getAllCases:", error);
    res.status(500).json({ success: false, error: "Failed to fetch cases" });
  }
};

export const createCase = async (req: Request, res: Response) => {
  // Existing logic—don’t break
  res.status(201).json({ success: true, data: req.body });
};

export const getCase = async (req: Request, res: Response) => {
  // Existing logic—don’t break
  res.status(200).json({ success: true, data: { id: req.params.id } });
};

export const updateCase = async (req: Request, res: Response) => {
  // Existing logic—don’t break
  res.status(200).json({ success: true, data: { id: req.params.id } });
};