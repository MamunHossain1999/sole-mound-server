"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const product_route_1 = __importDefault(require("./modules/product/product.route"));
const review_route_1 = __importDefault(require("./modules/review/review.route"));
const cart_route_1 = __importDefault(require("./modules/cart/cart.route"));
const chat_route_1 = __importDefault(require("./modules/chat/chat.route"));
const history_route_1 = __importDefault(require("./modules/browsingHistory/history.route"));
const wishlist_route_1 = __importDefault(require("./modules/wishlist/wishlist.route"));
const today_route_1 = __importDefault(require("./modules/weeklyDeals/today.route"));
const trending_route_1 = __importDefault(require("./modules/trendingProducts/trending.route"));
const payment_route_1 = __importDefault(require("./modules/payment/payment.route"));
const order_route_1 = __importDefault(require("./modules/order/order.route"));
const webhook_controller_1 = require("./modules/payment/webhook.controller");
const route_1 = __importDefault(require("./modules/bestSeller&topCategory/route"));
const banner_route_1 = __importDefault(require("./modules/banner/banner.route"));
const bank_route_1 = __importDefault(require("./modules/bankInfo/bank.route"));
const store_routes_1 = __importDefault(require("./modules/sellerStore/store.routes"));
const stats_route_1 = __importDefault(require("./modules/vistor/stats.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
/* =========================
   CORS
========================= */
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5174",
        "https://solo-mound.vercel.app",
        "http://localhost:5173",
        "https://sole-mound-seller.vercel.app",
    ],
    credentials: true,
}));
/* =========================
   WEBHOOK (IMPORTANT)
========================= */
app.use("/api/webhook", express_1.default.raw({ type: "application/json" }), webhook_controller_1.stripeWebhook);
/* =========================
   BODY PARSERS
========================= */
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
/* =========================
   ROUTES
========================= */
app.use("/api/auth", auth_routes_1.default);
app.use("/api", user_routes_1.default);
app.use("/api", product_route_1.default);
app.use("/api", review_route_1.default);
app.use("/api", cart_route_1.default);
app.use("/api", chat_route_1.default);
app.use("/api", history_route_1.default);
app.use("/api", wishlist_route_1.default);
app.use("/api", today_route_1.default);
app.use("/api", trending_route_1.default);
app.use("/api", route_1.default);
app.use("/api", banner_route_1.default);
app.use("/api", bank_route_1.default);
app.use("/api", store_routes_1.default);
app.use("/api", stats_route_1.default);
/* order + payment */
app.use("/api", order_route_1.default);
app.use("/api", payment_route_1.default);
/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
    res.send("Sole mound Server Running 🚀");
});
/* =========================
   ERROR HANDLER
========================= */
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
