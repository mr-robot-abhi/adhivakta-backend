import { Request, Response, NextFunction } from "express";
import { auth } from "../utils/firebaseAdmin";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    res.status(401).json({ success: false, error: "No token provided" });
    return; // Explicitly end the middleware flow
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // Attach decoded token to request
    next(); // Pass control to the next handler
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" });
    return; // Explicitly end the middleware flow
  }
};

declare global {
  namespace Express {
    interface Request {
      user?: any; // Simplified for now; refine with Firebase DecodedIdToken type if needed
    }
  }
}