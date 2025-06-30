import express from "express";
import { connectDB } from "./config/db";
import authRoutes from "./routes/Auth";
import contentRoutes from "./routes/UserContent";
const app = express();

//middlewares
app.use(express.json());

//db connection
connectDB();

//routes
app.use("/api/v1/auth", authRoutes);
console.log("post content hit");

app.use("/api/v1/content", contentRoutes);

app.listen(3000, () => {
  console.log("App is running at 3000");
});
