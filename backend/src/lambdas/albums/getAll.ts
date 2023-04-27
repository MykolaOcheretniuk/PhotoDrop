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
    if (role === Roles.PHOTOGRAPHER) {
      const albums = await albumsService.getAllPhotographer(personId);
      return responseCreator.default(JSON.stringify(albums), 200);
    }
    const albums = await albumsService.getAllUser(personId);
    return responseCreator.default(JSON.stringify(albums), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
