import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { apiRateLimiter, authRateLimiter } from "./middlewares/rateLimit";
import authRoutes from "./routes/Auth";
import contentRoutes from "./routes/UserContent";
import linkRoute from "./routes/Link";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

const allowedOrigins = new Set(
  [
    "https://keep-it-omega.vercel.app",
    process.env.FRONTEND_URL,
    process.env.NODE_ENV !== "production" ? "http://localhost:5173" : undefined,
    process.env.NODE_ENV !== "production" ? "http://127.0.0.1:5173" : undefined,
  ].filter(Boolean) as string[]
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (no Origin), allowlisted frontends,
      // and Chrome extensions (popup / service worker fetches).
      if (
        !origin ||
        allowedOrigins.has(origin) ||
        origin.startsWith("chrome-extension://")
      ) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/", apiRateLimiter);
app.use("/api/v1/auth", authRateLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/link", linkRoute);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err.message === "Not allowed by CORS") {
      res.status(403).json({ success: false, msg: "CORS blocked" });
      return;
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
);

const start = async () => {
  await connectDB();

  // Local / traditional Node host
  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`App is running at ${PORT}`);
    });
  }
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  if (!process.env.VERCEL) process.exit(1);
});

export default app;
