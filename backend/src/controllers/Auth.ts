import { User } from "../models/User";
import { auth } from "../zod-schema/Auth";

export const signupController = async (req: any, res: any) => {
  try {
    const userData = req.body;
    const { success } = auth.safeParse(userData);

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

export const signinController = async () => {};
