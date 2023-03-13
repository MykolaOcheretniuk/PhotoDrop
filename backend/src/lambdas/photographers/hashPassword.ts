import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { ApiError } from "src/errors/apiError";
import passwordService from "src/services/passwordService";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify(`Event body is missing`),
      };
    }
    const { password } = JSON.parse(event.body);
    const hash = await passwordService.hashPassword(password);
    return { statusCode: 200, body: JSON.stringify(`Password hash: ${hash}`) };
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
