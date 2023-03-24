import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { JwtPayload } from "jsonwebtoken";
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
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    const { Authorization: authToken } = event.headers;
    const tokenPayload = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    const { personId, personRole } = tokenPayload;
    await authService.checkAuth(authToken, personRole);
    if (event.pathParameters) {
      const updateField = event.pathParameters["updateField"] as string;
      const { data } = JSON.parse(event.body);
      switch (updateField.toLocaleLowerCase()) {
        case "email":
          await usersService.updateEmail(data, personId);
          return responseCreator.default(JSON.stringify("Email updated"), 200);
        case "name":
          await usersService.updateName(data, personId);
          return responseCreator.default(JSON.stringify("Name updated"), 200);
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
