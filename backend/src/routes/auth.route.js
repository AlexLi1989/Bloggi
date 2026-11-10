import passport from "passport";
import { Router } from "express";
const authRouter = Router();
import authController from "../controllers/auth.Controller.js";
import validateUser from "../validators/validateUser.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

//un-logged in user pipeline
authRouter.post(
  "/signup",
  validateUser,
  handleValidationErrors,
  authController.userCreatePost,
);

authRouter.post("/login", authController.userLoginPost);

export default authRouter;
