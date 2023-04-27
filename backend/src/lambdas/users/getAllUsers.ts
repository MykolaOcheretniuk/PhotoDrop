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
    if (!event.requestContext.authorizer) {
      return responseCreator.error(400);
    }
    const { role } = event.requestContext.authorizer;
    if (role !== Roles.PHOTOGRAPHER) {
      return responseCreator.forbiddenForRole(role);
    }
    const users = await usersService.getAllNumbers();
    return responseCreator.default(JSON.stringify(users), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
