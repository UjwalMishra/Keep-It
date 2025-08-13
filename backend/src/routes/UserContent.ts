import { Router } from "express";
import {
  deleteContentController,
  getContentController,
  getFilteredContentController,
  postContentController,
  updateContentController,
} from "../controllers/Content";
import { authorizationMiddleware } from "../middlewares/Authorization";

const router = Router();

//post content
router.post("/post-content", authorizationMiddleware, postContentController);

// update content
router.post(
  "/update-content/:id",
  authorizationMiddleware,
  updateContentController
);

//get all content
router.get("/get-all-content", authorizationMiddleware, getContentController);

//delete content
router.delete(
  "/delete-content",
  authorizationMiddleware,
  deleteContentController
);

//filter content
router.get(
  "/get-content",
  authorizationMiddleware,
  getFilteredContentController
);

export default router;
