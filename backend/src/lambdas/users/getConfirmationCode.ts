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
    if (!event.queryStringParameters) {
      await codesService.sendCode(phoneNumber);
      return responseCreator.default(JSON.stringify("Code sent!"), 200);
    }
    const { resend } = event.queryStringParameters;
    if (!resend) {
      return responseCreator.missedQueryStringParams();
    }
    if (/true/.test(resend)) {
      await codesService.resendCode(phoneNumber);
      return responseCreator.default(JSON.stringify("Code sent!"), 200);
    }
    return responseCreator.default(
      JSON.parse(`Incorrect query param resend = ${resend}`),
      400
    );
  } catch (err) {
    return responseCreator.error(err);
  }
};
