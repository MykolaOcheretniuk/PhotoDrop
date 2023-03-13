import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Roles } from "src/enums/roles";
import authService from "src/services/authService";
import { ApiError } from "src/errors/apiError";
import photosUploader from "src/services/photosUploader";
import s3Service from "src/services/s3Service";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.headers.Authorization) {
      return {
        statusCode: 400,
        body: JSON.stringify(`Authorization header is missing.`),
      };
    }
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify(`JSON body is missing.`),
      };
    }
    const { Authorization: authToken } = event.headers;
    const { albumId, photos } = JSON.parse(event.body);
    await authService.checkAuth(authToken, Roles.PHOTOGRAPHER);
    for (let i = 0; i < photos.length; i++) {
      const buf = Buffer.from(photos[i].data, "base64");
      await s3Service.uploadImage(buf, `test/${photos[i].name}`, "image/jpeg");
    }
    return { statusCode: 200, body: JSON.stringify("photo") };
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
