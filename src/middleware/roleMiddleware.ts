import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express"; // Import RequestHandler type

export const restrictTo = (...roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: "Access denied" });
      return;
    }
    next();
  };
};