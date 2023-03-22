import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import passwordService from "src/services/passwordService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    const { password } = JSON.parse(event.body);
    const hash = await passwordService.hashPassword(password);
    return responseCreator.default(`Password hash: ${hash}`, 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
