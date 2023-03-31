import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import usersService from "src/services/usersService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.headers.Authorization) {
      return responseCreator.missedAuthHeader();
    }
    const { Authorization: authToken } = event.headers;
    await authService.checkAuth(authToken, Roles.PHOTOGRAPHER);
    const users = await usersService.getAllNumbers();
    return responseCreator.default(JSON.stringify(users), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
