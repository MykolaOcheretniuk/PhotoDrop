import { PaymentError } from "src/errors/payment";
import Stripe from "stripe";
import getEnv from "./getEnv";

class StripeService {
  private stripe = new Stripe(getEnv("STRIPE_SECRET_KEY") as string, {
    apiVersion: "2022-11-15",
  });
  createIntent = async (
    toPay: number,
    currency: string,
    paymentTypes: string[],
    personId: string
  ): Promise<string> => {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: toPay,
      currency: currency,
      payment_method_types: paymentTypes,
      description: personId,
    });
    const { client_secret: clientSecret } = paymentIntent;
    if (!clientSecret) {
      throw PaymentError.NullClientSecret();
    }
    return clientSecret;
  };
}

const stripeService = new StripeService();
export default stripeService;
