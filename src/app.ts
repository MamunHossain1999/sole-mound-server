import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

import { errorMiddleware } from "./middlewares/error.middleware";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/product/product.route";
import reviewRoutes from "./modules/review/review.route";
import cartRoutes from "./modules/cart/cart.route";
import chatRoutes from "./modules/chat/chat.route";
import historyRoutes from "./modules/browsingHistory/history.route";
import wishlistRoutes from "./modules/wishlist/wishlist.route";
import weeklyDealsRoutes from "./modules/weeklyDeals/today.route";
import trendingRoutes from "./modules/trendingProducts/trending.route";
import paymentRoutes from "./modules/payment/payment.route";
import orderRoutes from "./modules/order/order.route";
import { stripeWebhook } from "./modules/payment/webhook.controller";
import topApiRoute from "./modules/bestSeller&topCategory/route";
import bannerRoute from "./modules/banner/banner.route";
import bankRoute from "./modules/bankInfo/bank.route";
import storeApi from "./modules/sellerStore/store.routes";
import statsRoute from "./modules/vistor/stats.route";

dotenv.config();

const app = express();

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://solo-mound.vercel.app",
      "http://localhost:5173",
      "https://sole-mound-seller.vercel.app",
    ],
    credentials: true,
  }),
);
/* =========================
   WEBHOOK (IMPORTANT)
========================= */
app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

/* =========================
   BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", reviewRoutes);
app.use("/api", cartRoutes);
app.use("/api", chatRoutes);
app.use("/api", historyRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", weeklyDealsRoutes);
app.use("/api", trendingRoutes);
app.use("/api", topApiRoute);
app.use("/api", bannerRoute);
app.use("/api", bankRoute);
app.use("/api", storeApi);
app.use("/api", statsRoute);

/* order + payment */
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

/* =========================
   ROOT
========================= */
app.get("/", (req: Request, res: Response) => {
  res.send("Sole mound Server Running 🚀");
});

/* =========================
   ERROR HANDLER
========================= */
app.use(errorMiddleware);

export default app;
