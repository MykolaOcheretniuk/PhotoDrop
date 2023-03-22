import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { LoginAndRegistrationModel } from "src/models/users/loginAndRegistration";
import authService from "src/services/authService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    const userData: LoginAndRegistrationModel = JSON.parse(event.body);
    const jwtResponse = await authService.loginRegisterUser(userData);
    return responseCreator.default(JSON.stringify(jwtResponse), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
