import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotnev from "dotenv";

dotnev.config();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authorizationMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer")) {
      res.status(403).json({
        msg: "No token found",
        success: false,
      });
      return;
    }

    const token = header.split(" ")[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT SECRET not found");
    }
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(403).json({
        success: false,
        msg: "token not have userId || wrong token",
      });
      return;
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err,
    });
    return;
  }
};
