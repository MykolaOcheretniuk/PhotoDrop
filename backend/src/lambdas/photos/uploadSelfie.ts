import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import { ApiError } from "src/errors/apiError";
import { HEADERS } from "../headers";
import usersService from "src/services/usersService";

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
    if (!event.pathParameters) {
      return {
        statusCode: 400,
        headers: HEADERS,
        body: JSON.stringify(`Path parameters is null.`),
      };
    }
    const { Authorization: authToken } = event.headers;
    await authService.checkAuth(authToken, Roles.USER);
    const body = JSON.parse(event.body);
    const { id: userId } = event.pathParameters;
    if (!userId) {
      return {
        statusCode: 400,
        headers: HEADERS,
        body: JSON.stringify(`Incorrect path parameters.`),
      };
    }
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
