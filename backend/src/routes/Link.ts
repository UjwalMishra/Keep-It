import { Router } from "express";
import {
  generateShareLinkController,
  openSharedLinkController,
} from "../controllers/Link";
import { authorizationMiddleware } from "../middlewares/Authorization";

const router = Router();

//gernerate the share link
router.post("/share", authorizationMiddleware, generateShareLinkController);

//get user's keepit data from link
router.get("/share/:sharedlink", openSharedLinkController);
export default router;
