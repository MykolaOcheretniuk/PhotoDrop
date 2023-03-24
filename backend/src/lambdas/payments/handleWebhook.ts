import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    const eventBody = JSON.parse(event.body);
    const stripeSignature = event.headers["Stripe-Signature"];

    return responseCreator.default(JSON.stringify("hello"), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
