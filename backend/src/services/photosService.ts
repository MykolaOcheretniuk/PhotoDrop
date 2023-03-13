import photosRepository from "src/db/repositories/photosRepository";
import { Photo } from "src/entities/photo";
import photoEditor from "./photoEditor";
import s3Service from "./s3Service";

class PhotosService {
  addNew = async (
    key: string,
    albumTitle: string,
    photoName: string,
    albumId: number
  ) => {
    const photoBuffer = await s3Service.getImageBuffer(key);
    const watermarkBuffer = await s3Service.getImageBuffer(
      process.env.WATERMARK_KEY as string
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
    await s3Service.uploadMany(promisesResult, keys);
    const photo: Photo = {
      albumId: albumId,
      isActivated: false,
      originalPhotoKey: key,
      watermarkedPhotoKey: watermarkedPhotoKey,
      thumbnailKey: thumbnailKey,
      watermarkedThumbnailKey: watermarkedThumbnailKey,
    };
    const result = await photosRepository.addNew(photo);
    return result;
  };
}
const photosService = new PhotosService();
export default photosService;
