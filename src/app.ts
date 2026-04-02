
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware";
import limiter from "./middlewares/rateLimit.middleware";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/product/product.route";



dotenv.config()
const app = express()


app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
// const upload = multer();



app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);


app.get("/", (req: Request, res: Response) => {
  res.send("FoodieLand Server Running 🚀");
});

app.use(errorMiddleware);
export default app;