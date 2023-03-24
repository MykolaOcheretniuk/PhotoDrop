import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { JwtPayload } from "jsonwebtoken";
import { Roles } from "src/enums/roles";
import { CreateAlbumModel } from "src/models/albums";
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
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    const { Authorization: authToken } = event.headers;
    await authService.checkAuth(authToken, Roles.PHOTOGRAPHER);
    const tokenPayload = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    const { personId: creatorId } = tokenPayload;
    const model = JSON.parse(event.body) as CreateAlbumModel;
    const result = await albumsService.create(model, creatorId);
    return responseCreator.default(JSON.stringify(result), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
