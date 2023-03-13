import albumsRepository from "src/db/repositories/albumsRepository";
import { ApiError } from "src/errors/apiError";
import { UploadPhoto } from "src/models/album/photos/uploadPhoto";
import s3Service from "./s3Service";

export class PhotosUploader {
  uploadMany = async (photos: UploadPhoto[], albumId: number) => {
    const album = await albumsRepository.getById(albumId);
    if (!album) {
      throw ApiError.NotFound("Album");
    }

  };
}
const photosUploader = new PhotosUploader();
export default photosUploader;
