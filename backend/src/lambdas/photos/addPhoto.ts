import { S3Event } from "aws-lambda";
import albumsService from "src/services/albumsService";
import photosService from "src/services/photoServices/photosService";
import responseCreator from "src/services/utils/responseCreator";

export const handler = async (event: S3Event) => {
  try {
    const { Records } = event;
    const key = decodeURI(Records[0].s3.object.key).replace("+", " ");
    const splittedKey = key.split("/");
    const albumTitle = decodeURI(splittedKey[2]).replace("+", " ");
    const userId = splittedKey[1];
    const photoName = splittedKey[3];
    const album = await albumsService.getByTitle(albumTitle);
    const { id: albumId } = album;
    if (!albumId) {
      return;
    }
    await photosService.addNew(key, albumTitle, photoName, albumId, userId);
    return;
  } catch (err) {
    return responseCreator.error(err);
  }
};
