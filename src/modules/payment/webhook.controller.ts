import Stripe from "stripe";
import { Order } from "../order/order.model";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const stripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Payment success event
  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntent.payment_method as string
    );

    const orderId = session.metadata?.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      transactionId: paymentIntent.id,
    });
  }

  res.json({ received: true });
};