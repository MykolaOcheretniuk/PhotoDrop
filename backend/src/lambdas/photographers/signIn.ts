import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { ApiError } from "src/errors/apiError";
import authService from "src/services/authService";
import { HEADERS } from "../headers";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: HEADERS,
        body: JSON.stringify(`Event body is missing`),
      };
    }
    const { password, login } = JSON.parse(event.body);
    const result = await authService.signInPhotographer(password, login);
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify(result) };
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
