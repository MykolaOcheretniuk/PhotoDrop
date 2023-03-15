import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { ApiError } from "src/errors/apiError";
import twilioSmsSender from "src/services/twilioSmsSender";
import crypto from "crypto";
import confirmationCodesStorage from "src/db/dynamoDB/confirmationCodesStorage";
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 404,
        body: JSON.stringify(`Event body is missing`),
      };
    }
    const { phoneNumber } = JSON.parse(event.body);
    const code = crypto.randomInt(100000, 999999).toString();
    await twilioSmsSender.sendMessage(code, phoneNumber);
    await confirmationCodesStorage.addCode(phoneNumber, code);
    return {
      statusCode: 200,
      body: JSON.stringify("Code sent."),
    };
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
