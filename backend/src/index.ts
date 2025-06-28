import express from "express";
import { connectDB } from "./config/db";

const app = express();

//middlewares
app.use(express.json());

//db connection
connectDB();

//routes
