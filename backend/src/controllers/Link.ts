import { Response } from "express";
import crypto from "crypto";
import { Link } from "../models/Link";
import { Content } from "../models/Content";
import { AuthRequest } from "../types/express";

export const generateShareLinkController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { share } = req.body;

    if (!share) {
      await Link.deleteOne({ userId: req.userId });
      res.status(200).json({
        success: true,
        msg: "Shared Link disabled",
      });
      return;
    }

    const existing = await Link.findOne({ userId: req.userId });
    if (existing) {
      res.status(200).json({
        success: true,
        msg: "Link already exists",
        link: existing.hash,
      });
      return;
    }

    const hash = crypto.randomBytes(12).toString("hex");
    await Link.create({
      userId: req.userId,
      hash,
    });

    res.status(201).json({
      success: true,
      msg: "Link created",
      link: hash,
    });
  } catch (err) {
    console.error("Error generating share link:", err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const openSharedLinkController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const hash = String(req.params.sharedlink || "").trim();

    if (!hash || hash.length < 8 || hash.length > 64) {
      res.status(400).json({
        success: false,
        msg: "Invalid share link",
      });
      return;
    }

    const link = await Link.findOne({ hash }).lean();
    if (!link) {
      res.status(404).json({
        success: false,
        msg: "Invalid or expired share link",
      });
      return;
    }

    const content = await Content.find({ userId: link.userId })
      .populate({ path: "tags" })
      .populate({ path: "userId", select: "username" })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      content,
    });
  } catch (err) {
    console.error("Error opening share link:", err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
