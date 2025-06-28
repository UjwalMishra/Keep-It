import { Router } from "express";
import { signupController, signinController } from "../controllers/Auth";

const router = Router();

//signup
router.post("/signup", signupController);

//signin
router.post("/signin", signinController);

export default router;
