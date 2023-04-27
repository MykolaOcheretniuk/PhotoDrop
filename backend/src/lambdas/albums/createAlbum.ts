import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import { CreateAlbumModel } from "src/models/albums";
import albumsService from "src/services/albumsService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    if (!event.requestContext.authorizer) {
      return responseCreator.error(400);
    }
    const { personId, role } = event.requestContext.authorizer;
    if (role !== Roles.PHOTOGRAPHER) {
      return responseCreator.forbiddenForRole(role);
    }
    const model = JSON.parse(event.body) as CreateAlbumModel;
    const result = await albumsService.create(model, personId);
    return responseCreator.default(JSON.stringify(result), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
