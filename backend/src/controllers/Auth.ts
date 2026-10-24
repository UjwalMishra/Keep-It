import { Request, Response } from "express";
import { User } from "../models/User";
import {
  refreshZodSchema,
  signinZodSchema,
  signupZodSchema,
} from "../zod-schema/Auth";
import { hashPassword, verifyPassword } from "../utils/password";
import {
  createAuthSession,
  revokeAllUserRefreshTokens,
  revokeRefreshToken,
  rotateRefreshToken,
} from "../utils/tokens";
import { AuthRequest } from "../types/express";

export const signupController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = signupZodSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        msg: "Invalid input",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const username = parsed.data.username.toLowerCase();
    const existing = await User.findOne({ username }).select("_id").lean();
    if (existing) {
      res.status(409).json({
        success: false,
        msg: "User already exists",
      });
      return;
    }

    const passwordHash = await hashPassword(parsed.data.password);
    await User.create({ username, password: passwordHash });

    res.status(201).json({
      success: true,
      msg: "User signup successfully",
    });
  } catch (err) {
    console.error("Error during user signup", err);
    res.status(500).json({
      success: false,
      msg: "Server failure",
    });
  }
};

export const signinController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = signinZodSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        msg: "Invalid input",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      res.status(500).json({
        success: false,
        msg: "Server misconfiguration",
      });
      return;
    }

    const username = parsed.data.username.toLowerCase();
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({
        success: false,
        msg: "Invalid username or password",
      });
      return;
    }

    const { ok, needsRehash } = await verifyPassword(
      parsed.data.password,
      user.password
    );

    if (!ok) {
      res.status(401).json({
        success: false,
        msg: "Invalid username or password",
      });
      return;
    }

    if (needsRehash) {
      user.password = await hashPassword(parsed.data.password);
      await user.save();
    }

    const { accessToken, refreshToken } = await createAuthSession({
      userId: String(user._id),
      username: user.username,
      userAgent: req.get("user-agent") || "",
    });

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      // backward compatible for older clients
      token: accessToken,
      expiresIn: 15 * 60,
    });
  } catch (err) {
    console.error("Error during user signin", err);
    res.status(500).json({
      success: false,
      msg: "Server failure",
    });
  }
};

export const refreshController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = refreshZodSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        msg: "refreshToken is required",
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({
        success: false,
        msg: "Server misconfiguration",
      });
      return;
    }

    const rotated = await rotateRefreshToken({
      rawRefreshToken: parsed.data.refreshToken,
      userAgent: req.get("user-agent") || "",
    });

    if (!rotated) {
      res.status(401).json({
        success: false,
        msg: "Invalid or expired refresh token",
      });
      return;
    }

    res.status(200).json({
      success: true,
      accessToken: rotated.accessToken,
      refreshToken: rotated.refreshToken,
      token: rotated.accessToken,
      expiresIn: 15 * 60,
    });
  } catch (err) {
    console.error("Error refreshing token", err);
    res.status(500).json({
      success: false,
      msg: "Server failure",
    });
  }
};

export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = refreshZodSchema.safeParse(req.body);
    if (parsed.success) {
      await revokeRefreshToken(parsed.data.refreshToken);
    }

    res.status(200).json({
      success: true,
      msg: "Logged out",
    });
  } catch (err) {
    console.error("Error during logout", err);
    res.status(500).json({
      success: false,
      msg: "Server failure",
    });
  }
};

/** Revoke every refresh session for the authenticated user. */
export const logoutAllController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, msg: "Authentication required" });
      return;
    }

    await revokeAllUserRefreshTokens(req.userId);

    res.status(200).json({
      success: true,
      msg: "Logged out from all devices",
    });
  } catch (err) {
    console.error("Error during logout-all", err);
    res.status(500).json({
      success: false,
      msg: "Server failure",
    });
  }
};
