import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { JwtPayload } from "jsonwebtoken";
import albumsService from "src/services/albumsService";
import authService from "src/services/authService";
import jwtTokensService from "src/services/utils/jwtTokensService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.headers.Authorization) {
      return responseCreator.missedAuthHeader();
    }
    const { Authorization: authToken } = event.headers;
    const tokenPayload = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    const { personId, personRole } = tokenPayload;
    await authService.checkAuth(authToken, personRole);
    if (event.pathParameters) {
      const id = event.pathParameters["id"] as string;
      if (!Number.isInteger(+id)) {
        return responseCreator.default("Id must be an integer", 400);
      }
      const album = await albumsService.getById(+id, personId);
      return responseCreator.default(JSON.stringify(album), 200);
    }
    const albums = await albumsService.getAll(personId);
    return responseCreator.default(JSON.stringify(albums), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
