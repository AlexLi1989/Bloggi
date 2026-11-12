import { Router } from "express";
const commentRouter = Router();
import ensureAuth from "../middlewares/ensureAuth.js";
import commentController from "../controllers/comment.controller.js";

commentRouter.post("/comments/:id", commentController.commentDelete);

export default commentRouter;
