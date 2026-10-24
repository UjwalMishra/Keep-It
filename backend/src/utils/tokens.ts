import crypto from "crypto";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/RefreshToken";
import { User } from "../models/User";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type AccessPayload = {
  userId: string;
  username: string;
  type: "access";
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function signAccessToken(userId: string, username: string): string {
  const payload: AccessPayload = {
    userId: String(userId),
    username,
    type: "access",
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function verifyAccessToken(token: string): AccessPayload {
  const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;

  if (decoded.type !== "access" || !decoded.userId) {
    throw new Error("Invalid access token");
  }

  return {
    userId: String(decoded.userId),
    username: String(decoded.username || ""),
    type: "access",
  };
}

export async function issueRefreshToken(params: {
  userId: string;
  familyId?: string;
  userAgent?: string;
}): Promise<{ refreshToken: string; familyId: string }> {
  const refreshToken = crypto.randomBytes(48).toString("base64url");
  const tokenHash = hashToken(refreshToken);
  const familyId = params.familyId || crypto.randomUUID();

  await RefreshToken.create({
    userId: params.userId,
    tokenHash,
    familyId,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    userAgent: (params.userAgent || "").slice(0, 300),
  });

  return { refreshToken, familyId };
}

export async function rotateRefreshToken(params: {
  rawRefreshToken: string;
  userAgent?: string;
}): Promise<{
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;
} | null> {
  const tokenHash = hashToken(params.rawRefreshToken);
  const existing = await RefreshToken.findOne({ tokenHash });

  if (!existing) {
    return null;
  }

  // Reuse of a revoked token → possible theft → kill the whole family
  if (existing.revokedAt) {
    await RefreshToken.updateMany(
      { familyId: existing.familyId, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );
    return null;
  }

  if (existing.expiresAt.getTime() <= Date.now()) {
    existing.revokedAt = new Date();
    await existing.save();
    return null;
  }

  const user = await User.findById(existing.userId).select("username").lean();
  if (!user) {
    existing.revokedAt = new Date();
    await existing.save();
    return null;
  }

  const { refreshToken: nextRefresh } = await issueRefreshToken({
    userId: String(existing.userId),
    familyId: existing.familyId,
    userAgent: params.userAgent,
  });

  existing.revokedAt = new Date();
  existing.replacedByHash = hashToken(nextRefresh);
  await existing.save();

  return {
    accessToken: signAccessToken(String(user._id), user.username),
    refreshToken: nextRefresh,
    userId: String(user._id),
    username: user.username,
  };
}

export async function revokeRefreshToken(rawRefreshToken: string): Promise<void> {
  const tokenHash = hashToken(rawRefreshToken);
  await RefreshToken.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
}

export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  await RefreshToken.updateMany(
    { userId, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
}

export async function createAuthSession(params: {
  userId: string;
  username: string;
  userAgent?: string;
}): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken(params.userId, params.username);
  const { refreshToken } = await issueRefreshToken({
    userId: params.userId,
    userAgent: params.userAgent,
  });

  return { accessToken, refreshToken };
}
