import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import { ApiError } from "src/errors/apiError";
import { HEADERS } from "../headers";
import usersService from "src/services/usersService";
import jwtTokensService from "src/services/jwtTokensService";
import { JwtPayload } from "jsonwebtoken";

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
    if (!event.body) {
      return {
        statusCode: 400,
        headers: HEADERS,
        body: JSON.stringify(`JSON body is missing.`),
      };
    }
    const { Authorization: authToken } = event.headers;
    const tokenPayload = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    const { personId: userId } = tokenPayload;
    await authService.checkAuth(authToken, Roles.USER);
    const body = JSON.parse(event.body);
    await usersService.uploadSelfie(body, userId);
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify("Selfie uploaded"),
    };
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
