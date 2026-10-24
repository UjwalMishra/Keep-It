import { Router } from "express";
import {
  signupController,
  signinController,
  refreshController,
  logoutController,
  logoutAllController,
} from "../controllers/Auth";
import { authorizationMiddleware } from "../middlewares/Authorization";
import { refreshRateLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/refresh", refreshRateLimiter, refreshController);
router.post("/logout", logoutController);
router.post("/logout-all", authorizationMiddleware, logoutAllController);

export default router;
