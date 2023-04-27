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
    const { role, personId } = event.requestContext.authorizer;
    if (role !== Roles.USER) {
      return responseCreator.forbiddenForRole(role);
    }
    if (event.pathParameters) {
      const updateField = event.pathParameters["getParameter"] as string;
      switch (updateField.toLocaleLowerCase()) {
        case "selfie":
          const profilePhotoUrl = await usersService.getSelfie(personId);
          return responseCreator.default(JSON.stringify(profilePhotoUrl), 200);
        case "details":
          const user = await usersService.getById(personId);
          return responseCreator.default(JSON.stringify(user), 200);
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
