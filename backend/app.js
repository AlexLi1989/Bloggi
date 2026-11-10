import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "./src/config/passport.js";

//routers
import authRouter from "./src/routes/auth.route.js";
// import blogRouter from "../routes/blog.route.js";
// import commentRouter from "./routes/comment.route.js";
// import dashboardRouter from "./routes/dashboard.route.js";

//middleware
// import notFoundHandler from "./middlewares/notFoundHandler.js";
// import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//cors config
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

//routes
app.use("/api/auth", authRouter);
// app.use("/api/blogs", blogRouter);
// app.use("/api/comments", commentRouter);
// app.use("/api/dashboard", dashboardRouter);

//404 route
// app.use(notFoundHandler);

//error route
// app.use(errorHandler);

export default app;
