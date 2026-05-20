import Stripe from "stripe";
import { Order } from "../order/order.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const stripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ================= PAYMENT SUCCESS =================
  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID missing in metadata",
      });
    }

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      status: "payment",
      transactionId: session.payment_intent,
    });
  }

  return res.json({ received: true });
};