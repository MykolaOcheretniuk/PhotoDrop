import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { JwtPayload } from "jsonwebtoken";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import usersService from "src/services/usersService";
import jwtTokensService from "src/services/utils/jwtTokensService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.headers.Authorization) {
      return responseCreator.missedAuthHeader();
    }
    const { Authorization: authToken } = event.headers;
    await authService.checkAuth(authToken, Roles.USER);
    const tokenPayload = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    const { personId } = tokenPayload;
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
