import photosRepository from "src/db/repositories/photosRepository";
import { S3Operations } from "src/enums/s3Operations";
import photoEditor from "./photoEditor";
import s3Service from "../awsServices/s3Service";
import getEnv from "../utils/getEnv";
import { InsertPhoto } from "src/db/schema/photo";
import { PhotoModel } from "src/models/photos";
import { PhotoKeys } from "src/enums/photoKeys";
import createKeys from "../utils/photoKeysCreator";

class PhotosService {
  addNew = async (
    key: string,
    albumTitle: string,
    photoName: string,
    albumId: string,
    userId: string
  ) => {
    const photoBuffer = await s3Service.getImageBuffer(key);
    const watermarkBuffer = await s3Service.getImageBuffer(
      getEnv("WATERMARK_KEY") as string
    );
    await photoEditor.setWatermark(watermarkBuffer);
    const thumbnailPromise = photoEditor.createThumbnail(photoBuffer);
    const thumbnailKey = `${PhotoKeys.THUMBNAILS}/${userId}/${albumTitle}/${photoName}`;
    const watermarkedPhotoPromise = photoEditor.addWatermark(photoBuffer);
    const watermarkedPhotoKey = `${PhotoKeys.WATERMARKED_PHOTOS}/${userId}/${albumTitle}/${photoName}`;
    const watermarkedThumbnailPromise =
      photoEditor.createWatermarkedThumbnail(photoBuffer);
    const watermarkedThumbnailKey = `${PhotoKeys.WATERMARKED_THUMBNAILS}/${userId}/${albumTitle}/${photoName}`;
    const promisesArray = new Array(
      thumbnailPromise,
      watermarkedPhotoPromise,
      watermarkedThumbnailPromise
    );
    const keys = new Array(
      thumbnailKey,
      watermarkedPhotoKey,
      watermarkedThumbnailKey
    );
    const promisesResult = await Promise.all(promisesArray);
    await s3Service.uploadEditedPhotos(promisesResult, keys);
    const photo: InsertPhoto = {
      albumId: albumId,
      albumTitle: albumTitle,
      photoName: photoName,
    };
    const result = await photosRepository.addNew(photo);
    const { insertId: photoId } = result[0];
    await photosRepository.associateWithUser(userId, photoId, albumId);
    return result;
  };
  getAlbumPhotos = async (
    albumId: string,
    personId: string
  ): Promise<PhotoModel[]> => {
    const photos = await photosRepository.getAlbumPhotos(albumId, personId);
    const result = photos.map(async (photo) => {
      const { albumTitle, photoName, id, isActivated } = photo;
      const { key, photoKey } = createKeys(
        albumTitle,
        photoName,
        personId,
        isActivated
      );
      const thumbnailUrl = await s3Service.createPreSignedUrl(
        key,
        S3Operations.GET_OBJECT
      );
      const originalPhotoUrl = await s3Service.createPreSignedUrl(
        photoKey,
        S3Operations.GET_OBJECT
      );
      return {
        id: id,
        thumbnailUrl: thumbnailUrl,
        originalUrl: originalPhotoUrl,
      };
    });
    return await Promise.all(result);
  };
  getAllUserPhotos = async (userId: string): Promise<PhotoModel[]> => {
    const photos = await photosRepository.getAllUserPhotos(userId);
    const result = photos.map(async (photo) => {
      const { isActivated, albumTitle, photoName, id } = photo;
      const { key, photoKey } = createKeys(
        albumTitle,
        photoName,
        userId,
        isActivated
      );
      const thumbnailUrl = await s3Service.createPreSignedUrl(
        key,
        S3Operations.GET_OBJECT
      );
      const originalPhotoUrl = await s3Service.createPreSignedUrl(
        photoKey,
        S3Operations.GET_OBJECT
      );
      return {
        id: id,
        thumbnailUrl: thumbnailUrl,
        originalUrl: originalPhotoUrl,
      };
    });
    return await Promise.all(result);
  };
}
const photosService = new PhotosService();
export default photosService;
