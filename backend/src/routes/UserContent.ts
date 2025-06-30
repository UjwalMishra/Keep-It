import { Router } from "express";
import {
  getContentController,
  postContentController,
} from "../controllers/Content";
import { authorizationMiddleware } from "../middlewares/Authorization";

const router = Router();

//post content
console.log("post content hit");

router.post("/postContent", authorizationMiddleware, postContentController);

//get content
router.get("/getAllContent", authorizationMiddleware, getContentController);

export default router;
