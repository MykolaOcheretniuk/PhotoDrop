import albumsRepository from "src/db/repositories/albumsRepository";
import photosRepository from "src/db/repositories/photosRepository";
import { Photo } from "src/entities/photo";
import { S3Operations } from "src/enums/s3Operations";
import { ApiError } from "src/errors/apiError";
import { PhotoModel } from "src/models/photos/photo";
import photoEditor from "./photoEditor";
import s3Service from "../awsServices/s3Service";
import getEnv from "../utils/getEnv";

class PhotosService {
  addNew = async (
    key: string,
    albumTitle: string,
    photoName: string,
    albumId: number
  ) => {
    const existingPhoto = await photosRepository.getByNameInAlbum(
      photoName,
      albumId
    );
    if (existingPhoto) {
      return;
    }
    const photoBuffer = await s3Service.getImageBuffer(key);
    const watermarkBuffer = await s3Service.getImageBuffer(
      getEnv("WATERMARK_KEY") as string
    );
    await photoEditor.setWatermark(watermarkBuffer);
    const thumbnailPromise = photoEditor.createThumbnail(photoBuffer);
    const thumbnailKey = `thumbnails/${albumTitle}/${photoName}`;
    const watermarkedPhotoPromise = photoEditor.addWatermark(photoBuffer);
    const watermarkedPhotoKey = `watermarkedPhotos/${albumTitle}/${photoName}`;
    const watermarkedThumbnailPromise =
      photoEditor.createWatermarkedThumbnail(photoBuffer);
    const watermarkedThumbnailKey = `watermarkedThumbnails/${albumTitle}/${photoName}`;
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
    const photo: Photo = {
      albumId: albumId,
      albumTitle: albumTitle,
      photoName: photoName,
    };
    const result = await photosRepository.addNew(photo);
    return result;
  };
  getAlbumPhotos = async (
    albumId: number,
    personId: string
  ): Promise<PhotoModel[]> => {
    const isAlbumActivated = await albumsRepository.isAlbumActivated(
      personId,
      albumId
    );
    let baseKey = "watermarkedThumbnails/";
    if (isAlbumActivated) {
      baseKey = "thumbnails/";
    }
    const photos = await photosRepository.getAlbumPhotos(albumId);
    const result = photos.map(async (photo) => {
      const { albumTitle, photoName, id } = photo;
      const key = baseKey + `${albumTitle}/${photoName}`;
      const accessUrl = await s3Service.createPreSignedUrl(
        key,
        S3Operations.GET_OBJECT
      );
      if (!id) {
        throw ApiError.IsNull("Id");
      }
      return { id: id, url: accessUrl };
    });
    return await Promise.all(result);
  };
  getAllPersonPhotos = async (personId: string): Promise<PhotoModel[]> => {
    const photos = await photosRepository.getAllPersonPhotos(personId);
    const result = photos.map(async (photo) => {
      const { isActivated, albumTitle, photoName, id } = photo;
      let baseKey = "thumbnails/";
      if (!isActivated) {
        baseKey = "watermarkedThumbnails/";
      }
      const key = baseKey + `${albumTitle}/${photoName}`;
      const accessUrl = await s3Service.createPreSignedUrl(
        key,
        S3Operations.GET_OBJECT
      );
      return { id: id, url: accessUrl };
    });
    return await Promise.all(result);
  };
}
const photosService = new PhotosService();
export default photosService;
