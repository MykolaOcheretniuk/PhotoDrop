import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { JwtPayload } from "jsonwebtoken";
import { Roles } from "src/enums/roles";
import { ApiError } from "src/errors/apiError";
import authService from "src/services/authService";
import jwtTokensService from "src/services/jwtTokensService";
import photosService from "src/services/photoServices/photosService";
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
    const { personId } = tokenPayload;
    await authService.checkAuth(authToken, Roles.USER);
    const photos = await photosService.getAllPersonPhotos(personId);
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify(photos) };
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
