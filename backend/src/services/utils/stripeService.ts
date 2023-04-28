import { PaymentIntentDescription } from "src/models/payments";
import Stripe from "stripe";
import getEnv from "./getEnv";

class StripeService {
  private stripe = new Stripe(getEnv("STRIPE_SECRET_KEY") as string, {
    apiVersion: "2022-11-15",
  });
  createSession = async (
    toPay: number,
    currency: string,
    description: PaymentIntentDescription,
    productDescription: string
  ): Promise<string | null> => {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Payment",
              description: `Album: ${productDescription}`,
            },
            unit_amount: toPay,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
      payment_intent_data: {
        description: JSON.stringify(description),
      },
    });
    return session.url;
  };
}

const stripeService = new StripeService();
export default stripeService;
