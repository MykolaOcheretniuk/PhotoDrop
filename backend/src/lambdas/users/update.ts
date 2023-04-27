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
    if (event.pathParameters) {
      const updateField = event.pathParameters["updateField"] as string;
      const { data } = JSON.parse(event.body);
      switch (updateField.toLocaleLowerCase()) {
        case "email":
          const emailResult = await usersService.updateEmail(data, personId);
          return responseCreator.default(JSON.stringify(emailResult), 200);
        case "name":
          const nameResult = await usersService.updateName(data, personId);
          return responseCreator.default(JSON.stringify(nameResult), 200);
        default:
          return responseCreator.default(
            JSON.stringify("Incorrect path params"),
            400
          );
      }
    }
    return responseCreator.default(
      JSON.stringify("Incorrect path params"),
      400
    );
  } catch (err) {
    return responseCreator.error(err);
  }
};
