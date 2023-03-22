import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import codesService from "src/services/codesService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    const { phoneNumber } = JSON.parse(event.body);
    await codesService.sendCode(phoneNumber);
    return responseCreator.default("Code sent!", 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
