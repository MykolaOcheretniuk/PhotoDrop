import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import { ApiError } from "src/errors/apiError";
import authService from "src/services/authService";

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
    const { Authorization: authToken } = event.headers;
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify(`Event body is missing`),
      };
    }
    await authService.checkAuth(authToken, Roles.PHOTOGRAPHER);
    const { refreshToken } = JSON.parse(event.body);
    const result = await authService.refresh(refreshToken);
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
