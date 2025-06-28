import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  const mongoUrl: string | undefined = process.env.MONGODB_URL;

  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not defined in the environment variables.");
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("DB connected");
  } catch (err) {
    console.log("DB connection failed ", err);
  }
};
