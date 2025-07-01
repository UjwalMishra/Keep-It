import express from "express";
import { connectDB } from "./config/db";
//routes
import authRoutes from "./routes/Auth";
import contentRoutes from "./routes/UserContent";
import linkRoute from "./routes/Link";
const app = express();

//middlewares
app.use(express.json());

//db connection
connectDB();

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/link", linkRoute);

app.listen(3000, () => {
  console.log("App is running at 3000");
});
