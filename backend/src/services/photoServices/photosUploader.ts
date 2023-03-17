import albumsRepository from "src/db/repositories/albumsRepository";
import { ApiError } from "src/errors/apiError";
import { UploadPhoto } from "src/models/photos/uploadPhoto";
import s3Service from "../awsServices/s3Service";

export class PhotosUploader {
  uploadMany = async (photos: UploadPhoto[], albumId: number) => {
    const album = await albumsRepository.getById(albumId);
    if (!album) {
      throw ApiError.NotFound("Album");
    }
    const promises = photos.map(async (photo) => {
      const { data, name, type } = photo;
      const key = `originalPhotos/${album.title}/${name}`;
      const buffer = Buffer.from(data, "base64");
      await s3Service.uploadImage(buffer, key, type);
    });
    await Promise.all(promises);
  };
}
const photosUploader = new PhotosUploader();
export default photosUploader;
