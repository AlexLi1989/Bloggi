import { Router } from "express";
const authRouter = Router();
import authController from "../controllers/auth.controller.js";
import validateUser from "../validators/validateUser.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import authLimiter from "../middlewares/rateLimiter.js";

//un-logged in user pipeline
authRouter.post(
  "/signup",
  authLimiter,
  validateUser,
  handleValidationErrors,
  authController.userCreatePost,
);

authRouter.post("/login", authLimiter, authController.userLoginPost);

export default authRouter;
