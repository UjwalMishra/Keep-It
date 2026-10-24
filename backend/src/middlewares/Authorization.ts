import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/express";
import { verifyAccessToken } from "../utils/tokens";

export const authorizationMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({
        msg: "Authentication required",
        success: false,
      });
      return;
    }

    const token = header.slice(7).trim();
    if (!token) {
      res.status(401).json({
        msg: "Authentication required",
        success: false,
      });
      return;
    }

    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({
      success: false,
      msg: "Invalid or expired token",
    });
  }
};
