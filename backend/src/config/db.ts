import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not defined in the environment variables.");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10_000,
      maxPoolSize: 10,
    });
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection failed", err);
    throw err;
  }
};
