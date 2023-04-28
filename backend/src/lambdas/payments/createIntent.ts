import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import { PaymentIntentDescription } from "src/models/payments";
import albumsService from "src/services/albumsService";
import responseCreator from "src/services/utils/responseCreator";
import stripeService from "src/services/utils/stripeService";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.requestContext.authorizer) {
      return responseCreator.error(400);
    }
    const { personId, role } = event.requestContext.authorizer;
    if (role !== Roles.USER) {
      return responseCreator.forbiddenForRole(role);
    }
    if (event.queryStringParameters) {
      const purchaseObject = event.queryStringParameters;
      if ("albumId" in purchaseObject) {
        const albumId = purchaseObject["albumId"] as string;
        if (!(await albumsService.isPersonHasAlbum(personId, albumId))) {
          return responseCreator.default(
            JSON.stringify(
              `Person with id:${personId} doesn't has album: ${albumId}`
            ),
            400
          );
        }
        if (await albumsService.isAlbumActivated(personId, albumId)) {
          return responseCreator.default(
            JSON.stringify(
              `Person with id:${personId} already has album :${albumId}`
            ),
            400
          );
        }
        const existingAlbum = await albumsService.getById(albumId);
        const { price: albumPrice, title } = existingAlbum;
        const description: PaymentIntentDescription = {
          personId: personId,
          albumId: albumId,
        };
        const paymentUrl = await stripeService.createSession(
          albumPrice * 100,
          "usd",
          description,
          title
        );
        return responseCreator.default(
          JSON.stringify({ paymentUrl: paymentUrl }),
          200
        );
      }
      return responseCreator.default(
        JSON.stringify("Incorrect query params"),
        400
      );
    }
    return responseCreator.missedQueryStringParams();
  } catch (err) {
    return responseCreator.error(err);
  }
};
