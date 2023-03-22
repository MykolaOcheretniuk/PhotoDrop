import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import albumsService from "src/services/albumsService";
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
    const { albumId, clients } = JSON.parse(event.body);
    await authService.checkAuth(authToken, Roles.PHOTOGRAPHER);
    await albumsService.addClients(albumId, clients);
    return responseCreator.default("Clients added", 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
