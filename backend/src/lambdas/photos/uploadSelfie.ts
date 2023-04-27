import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import usersService from "src/services/usersService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    if (!event.requestContext.authorizer) {
      return responseCreator.error(400);
    }
    const { role, personId } = event.requestContext.authorizer;
    if (role !== Roles.USER) {
      return responseCreator.forbiddenForRole(role);
    }
    const body = JSON.parse(event.body);
    const selfieUrl = await usersService.uploadSelfie(body, personId);
    return responseCreator.default(JSON.stringify(selfieUrl), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
