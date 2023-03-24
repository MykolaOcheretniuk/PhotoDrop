import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { JwtPayload } from "jsonwebtoken";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import jwtTokensService from "src/services/utils/jwtTokensService";
import responseCreator from "src/services/utils/responseCreator";
import stripeService from "src/services/utils/stripeService";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.headers.Authorization) {
      return responseCreator.missedAuthHeader();
    }
    const { Authorization: authToken } = event.headers;
    await authService.checkAuth(authToken, Roles.USER);
    if (event.queryStringParameters) {
      const purchaseObject = event.queryStringParameters;
      if ("albumId" in purchaseObject) {
        const tokenPayload = (await jwtTokensService.validateAccessToken(
          authToken
        )) as JwtPayload;
        const { personId } = tokenPayload;
        const clientSecret = await stripeService.createIntent(
          500,
          "usd",
          ["card"],
          personId
        );
        return responseCreator.default(JSON.stringify(clientSecret), 200);
      }
      return responseCreator.default(
        JSON.stringify("Incorrect query params"),
        400
      );
    }
    return responseCreator.missedQueryStringParams();
  } catch (err) {
    return responseCreator.error(err);
  }
};
