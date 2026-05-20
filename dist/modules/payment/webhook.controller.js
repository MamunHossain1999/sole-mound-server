"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = void 0;
const stripe_1 = __importDefault(require("stripe"));
const order_model_1 = require("../order/order.model");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // ================= PAYMENT SUCCESS =================
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID missing in metadata",
            });
        }
        await order_model_1.Order.findByIdAndUpdate(orderId, {
            paymentStatus: "paid",
            status: "payment",
            transactionId: session.payment_intent,
        });
    }
    return res.json({ received: true });
};
exports.stripeWebhook = stripeWebhook;
