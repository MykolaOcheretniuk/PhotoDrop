import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import albumsService from "src/services/albumsService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.requestContext.authorizer) {
      return responseCreator.error(400);
    }
    const { personId, role } = event.requestContext.authorizer;
    if (!event.queryStringParameters) {
      return responseCreator.missedQueryStringParams();
    }
    const id = event.queryStringParameters["id"] as string;
    if (role === Roles.PHOTOGRAPHER) {
      const album = await albumsService.getById(id);
      if (album.photographerId !== personId) {
        return responseCreator.default(
          JSON.stringify(`Person with id${personId} has no album:${id}`),
          403
        );
      }
      return responseCreator.default(JSON.stringify(album), 200);
    }
    const isPersonHasAlbum = await albumsService.isPersonHasAlbum(personId, id);
    if (!isPersonHasAlbum) {
      return responseCreator.default(
        JSON.stringify(`Person with id${personId} has no album:${id}`),
        403
      );
    }
    const album = await albumsService.getWithPhotos(id, personId);
    return responseCreator.default(JSON.stringify(album), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
