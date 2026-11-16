import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "./src/config/passport.js";

//routers
import authRouter from "./src/routes/auth.route.js";
import blogRouter from "./src/routes/blog.route.js";
import commentRouter from "./src/routes/comment.route.js";
import dashboardRouter from "./src/routes/dashboard.route.js";

//middleware
import notFoundHandler from "./src/middlewares/notFoundHandler.js";
import errorHandler from "./src/middlewares/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("trust proxy", 1); //for deployment

//cors config
const corsOptions = {
  origin: [process.env.VIEW_CLIENT_URL, process.env.WRITE_CLIENT_URL].filter(
    Boolean,
  ), // filter boolean in case missing either url
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

//routes
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/comments", commentRouter);
app.use("/api/dashboard", dashboardRouter);

//404 route
app.use(notFoundHandler);

//error route
app.use(errorHandler);

export default app;
