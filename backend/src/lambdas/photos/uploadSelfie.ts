import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import usersService from "src/services/usersService";
import jwtTokensService from "src/services/jwtTokensService";
import { JwtPayload } from "jsonwebtoken";
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
    const { personId: userId } = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    await authService.checkAuth(authToken, Roles.USER);
    const body = JSON.parse(event.body);
    await usersService.uploadSelfie(body, userId);
    return responseCreator.default("Selfie uploaded", 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
