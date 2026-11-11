import { Router } from "express";
const dashboardRouter = Router();
import dashboardController from "../controllers/dashboard.controller.js";
import ensureAuth from "../middlewares/ensureAuth.js";

dashboardRouter.get("/blogs", ensureAuth, dashboardController.allBlogsGet);
