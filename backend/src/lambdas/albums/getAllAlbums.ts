import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { JwtPayload } from "jsonwebtoken";
import { ApiError } from "src/errors/apiError";
import albumsService from "src/services/albumsService";
import authService from "src/services/authService";
import jwtTokensService from "src/services/jwtTokensService";
import { HEADERS } from "../headers";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.headers.Authorization) {
      return {
        statusCode: 400,
        headers: HEADERS,
        body: JSON.stringify(`Authorization header is missing.`),
      };
    }
    const { Authorization: authToken } = event.headers;

    const tokenPayload = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    const { personId: photographerId, personRole } = tokenPayload;
    await authService.checkAuth(authToken, personRole);
    const albums = await albumsService.getAll(photographerId);
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify(albums) };
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        statusCode: err.code,
        headers: HEADERS,
        body: JSON.stringify(`${err}`),
      };
    }
    return {
      statusCode: 400,
      headers: HEADERS,
      body: JSON.stringify(`Bad request: ${err}`),
    };
  }
};
