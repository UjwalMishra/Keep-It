import { Router } from "express";
import {
  deleteContentController,
  getContentController,
  postContentController,
} from "../controllers/Content";
import { authorizationMiddleware } from "../middlewares/Authorization";

const router = Router();

//post content
router.post("/post-content", authorizationMiddleware, postContentController);

//get all content
router.get("/get-all-content", authorizationMiddleware, getContentController);

//delete content
router.delete(
  "/delete-content",
  authorizationMiddleware,
  deleteContentController
);

export default router;
