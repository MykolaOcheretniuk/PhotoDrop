import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { JwtPayload } from "jsonwebtoken";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import jwtTokensService from "src/services/jwtTokensService";
import photosService from "src/services/photoServices/photosService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.headers.Authorization) {
      return responseCreator.missedAuthHeader();
    }
    const { Authorization: authToken } = event.headers;
    const { personId } = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    await authService.checkAuth(authToken, Roles.USER);
    const photos = await photosService.getAllPersonPhotos(personId);
    return responseCreator.default(JSON.stringify(photos), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
