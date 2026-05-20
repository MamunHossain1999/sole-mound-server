"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const order_model_1 = require("../order/order.model");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createCheckoutSession = async (req, res) => {
    try {
        console.log("📩 CHECKOUT BODY:", req.body);
        const { orderId, customerEmail } = req.body;
        const order = await order_model_1.Order.findById(orderId);
        if (!order) {
            console.log("❌ ORDER NOT FOUND");
            return res.status(404).json({ message: "Order not found" });
        }
        console.log("✅ ORDER FOUND:", order._id);
        const lineItems = order.products.map((item) => {
            console.log("🛒 ITEM:", item);
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name || "Product",
                        metadata: {
                            productId: String(item.productId),
                        },
                    },
                    unit_amount: Math.round(Number(item.price) * 100),
                },
                quantity: item.quantity,
            };
        });
        console.log("🚀 CREATING STRIPE SESSION...");
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            metadata: {
                orderId: String(orderId),
            },
            success_url: "http://localhost:5173/checkout-success",
            cancel_url: "http://localhost:5173/cancel",
            customer_email: customerEmail,
        });
        console.log("✅ SESSION CREATED:", session.id);
        console.log("🔗 URL:", session.url);
        return res.json({
            success: true,
            url: session.url,
        });
    }
    catch (error) {
        console.log("🔥 CHECKOUT ERROR:", error.message);
        return res.status(500).json({ message: error.message });
    }
};
exports.createCheckoutSession = createCheckoutSession;
