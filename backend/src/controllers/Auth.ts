import { User } from "../models/User";
import { authZodSchema } from "../zod-schema/Auth";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signupController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userData = req.body;
    const { success } = authZodSchema.safeParse(userData);

    if (!success) {
      return res.status(411).json({
        msg: "You have sent the wrong input",
        success: false,
      });
    }

    //if user already exists
    const isUserExist = await User.findOne({ username: userData.username });
    if (isUserExist) {
      return res.status(403).json({
        msg: "User already exists",
        success: false,
      });
    }

    const user = await User.create({
      username: userData.username,
      password: userData.password,
    });

    console.log("User signup : ", user);

    return res.status(200).json({
      msg: "User signup successfully",
    });
  } catch (err) {
    console.log("Error during user signup ", err);

    return res.status(500).json({
      msg: "Server failure",
    });
  }
};

export const signinController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userData = req.body;
    const { success } = authZodSchema.safeParse(userData);

    if (!success) {
      return res.status(411).json({
        msg: "You have sent the wrong input",
        success: false,
      });
    }

    const user = await User.findOne({ username: userData.username });
    if (!user) {
      return res.status(403).json({
        msg: "User does not exists",
        success: false,
      });
    }

    if (userData.password !== user.password) {
      return res.status(403).json({
        msg: "Wrong Password",
        success: false,
      });
    }
    const payload = {
      userId: user._id,
      username: user.username,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(payload, secret);

    return res.status(200).json({
      token: token,
      success: true,
    });
  } catch (err) {
    console.log("Error during user signin ", err);

    return res.status(500).json({
      msg: "Server failure",
    });
  }
};
