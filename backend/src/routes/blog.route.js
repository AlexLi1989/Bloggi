import { Router } from "express";
const blogRouter = Router();
import blogController from "../controllers/blog.controller.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import ensureAuth from "../middlewares/ensureAuth.js";
import validateBlog from "../validators/validateBlog.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

//dynamic pipeline
blogRouter.get("/", optionalAuth, blogController.blogsGet);

blogRouter.get("/:id", optionalAuth, blogController.blogGet);

//auth pipeline
blogRouter.post(
  "/",
  ensureAuth,
  validateBlog,
  handleValidationErrors,
  blogController.blogCreatePost,
);

blogRouter.put(
  "/:id",
  ensureAuth,
  validateBlog,
  handleValidationErrors,
  blogController.blogUpdatePut,
);

blogRouter.delete("/:id", ensureAuth, blogController.blogDelete);

export default blogRouter;
