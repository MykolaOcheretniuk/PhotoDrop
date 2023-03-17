import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import { ApiError } from "src/errors/apiError";
import authService from "src/services/authService";
import usersService from "src/services/usersService";
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
    await authService.checkAuth(authToken, Roles.PHOTOGRAPHER);
    const users = await usersService.getAll();
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify(users) };
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
