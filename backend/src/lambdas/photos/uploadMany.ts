import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import photosUploader from "src/services/photoServices/photosUploader";
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
    const { role } = event.requestContext.authorizer;
    if (role !== Roles.PHOTOGRAPHER) {
      responseCreator.forbiddenForRole(role);
    }
    const { albumId, photos } = JSON.parse(event.body);
    await photosUploader.uploadMany(photos, albumId);
    return responseCreator.default(JSON.stringify("Photos uploaded"), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
