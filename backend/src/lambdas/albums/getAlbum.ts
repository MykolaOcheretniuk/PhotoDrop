import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import { ApiError } from "src/errors/apiError";
import albumsService from "src/services/albumsService";
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
    await authService.checkAuth(authToken, Roles.PHOTOGRAPHER);
    if (!event.queryStringParameters) {
      return {
        statusCode: 400,
        body: JSON.stringify(`Query string parameters is missing.`),
      };
    }
    const id = event.queryStringParameters["id"] as string;
    const album = await albumsService.getById(+id);
    return { statusCode: 200, body: JSON.stringify(album) };
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
