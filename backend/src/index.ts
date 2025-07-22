import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
//routes
import authRoutes from "./routes/Auth";
import contentRoutes from "./routes/UserContent";
import linkRoute from "./routes/Link";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
//middlewares
app.use(express.json());

const allowedOrigins = [
  "https://keep-it-omega.vercel.app",
  process.env.FRONTEND_URL,
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

//db connection
connectDB();

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/link", linkRoute);

app.listen(PORT, () => {
  console.log("App is running at 3000");
});
