import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import { ApiError } from "src/errors/apiError";
import jwtTokensService from "src/services/jwtTokensService";
import { JwtPayload } from "jsonwebtoken";
import photosService from "src/services/photosService";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.headers.Authorization) {
      return {
        statusCode: 400,
        body: JSON.stringify(`Authorization header is missing.`),
      };
    }
    if (!event.pathParameters) {
      return {
        statusCode: 400,
        body: JSON.stringify(`Path parameters is required`),
      };
    }
    const { albumId } = event.pathParameters;
    if (!albumId) {
      return {
        statusCode: 400,
        body: JSON.stringify(`Incorrect path parameters`),
      };
    }
    const { Authorization: authToken } = event.headers;
    await authService.checkAuth(authToken, Roles.PHOTOGRAPHER);
    const tokenPayload = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    const { personId } = tokenPayload;
    const result = await photosService.getAlbumPhotos(+albumId, personId);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        statusCode: err.code,
        body: JSON.stringify(`${err}`),
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify(`Bad request: ${err}`),
    };
  }
};
