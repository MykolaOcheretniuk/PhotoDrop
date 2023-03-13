import { S3Event } from "aws-lambda";
import { ApiError } from "src/errors/apiError";
import albumsService from "src/services/albumsService";
import photosService from "src/services/photosService";

export const handler = async (event: S3Event) => {
  try {
    const { Records } = event;
    const key = Records[0].s3.object.key;
    const splittedKey = key.split("/");
    const albumTitle = splittedKey[1];
    const photoName = splittedKey[2];
    const album = await albumsService.getByTitle(albumTitle);
    const { id: albumId } = album;
    if (!albumId) {
      return { statusCode: 400 };
    }
    const result = await photosService.addNew(
      key,
      albumTitle,
      photoName,
      albumId
    );
    return { statusCode: 200, body: JSON.stringify(result) };
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
