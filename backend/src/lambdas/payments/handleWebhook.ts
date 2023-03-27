import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { PaymentIntentDescription } from "src/models/payments";
import albumsService from "src/services/albumsService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    const eventBody = JSON.parse(event.body);
    switch (eventBody.type) {
      case "payment_intent.succeeded": {
        const description: PaymentIntentDescription = JSON.parse(
          eventBody.data.object.description
        );
        const { albumId, personId } = description;
        await albumsService.activateAlbum(albumId, personId);
      }
    }

    return responseCreator.default(JSON.stringify("Webhook handled"), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
