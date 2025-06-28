import express from "express";
import { connectDB } from "./config/db";
import authRoutes from "./routes/Auth";

const app = express();

//middlewares
app.use(express.json());

//db connection
connectDB();

//routes
app.use("/api/v1/auth", authRoutes);

app.listen(3000, () => {
  console.log("App is running at 3000");
});
