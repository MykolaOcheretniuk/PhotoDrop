import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { ApiError } from "src/errors/apiError";
import { LoginAndRegistrationModel } from "src/models/users/loginAndRegistration";
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
    const userData: LoginAndRegistrationModel = JSON.parse(event.body);
    const jwtResponse = await authService.loginRegisterUser(userData);
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(jwtResponse),
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
