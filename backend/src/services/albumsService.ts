import { randomUUID } from "crypto";
import albumsRepository from "src/db/repositories/albumsRepository";
import { InsertAlbum } from "src/db/schema/album";
import { AlbumError } from "src/errors/albumError";
import { ApiError } from "src/errors/apiError";
import {
  AlbumDetails,
  AlbumInfo,
  CreateAlbumModel,
  UserAlbumModel,
} from "src/models/albums";
import photosService from "./photoServices/photosService";
import { format } from "date-fns";
import photosRepository from "src/db/repositories/photosRepository";
import { PhotoKeys } from "src/enums/photoKeys";
import s3Service from "./awsServices/s3Service";
import { S3Operations } from "src/enums/s3Operations";

class AlbumsService {
  create = async (albumModel: CreateAlbumModel, creatorId: string) => {
    const { title, location, dataPicker } = albumModel;
    const albumId = randomUUID();
    const newAlbum: InsertAlbum = {
      id: albumId,
      title: title,
      location: location,
      dataPicker: dataPicker,
      createdDate: new Date(),
      photographerId: creatorId,
    };
    await albumsRepository.addNew(newAlbum);
    const { id, createdDate } = newAlbum;
    return Object.assign({}, newAlbum, {
      id: id,
      createdDate: format(createdDate, "yyyy-MM-dd"),
      dataPicker: undefined,
      photographerId: undefined,
      price: undefined,
    });
  };
  getById = async (albumId: string) => {
    const existingAlbum = await albumsRepository.getById(albumId);
    if (!existingAlbum) {
      throw ApiError.NotFound("Album");
    }
    const { id } = existingAlbum;
    return { id: id };
  };
  getAllPhotographer = async (photographerId: string): Promise<AlbumInfo[]> => {
    const albums = await albumsRepository.getAllPhotographerAlbums(
      photographerId
    );
    const result: AlbumInfo[] = albums.map((album) => {
      const { id, createdDate } = album;
      return Object.assign({}, album, {
        id: id,
        createdDate: format(createdDate, "yyyy-MM-dd"),
        dataPicker: undefined,
        photographerId: undefined,
        price: undefined,
      });
    });
    return result;
  };
  getAllUser = async (userId: string): Promise<UserAlbumModel[]> => {
    const albums = await albumsRepository.getAllUserAlbums(userId);
    const result = albums.map(async (album) => {
      const { id: albumId, title: albumTitle } = album;
      const previewPhoto = await photosRepository.getFirstAlbumPhoto(albumId);
      const { photoName } = previewPhoto;
      const previewKey = `${PhotoKeys.THUMBNAILS}/${userId}/${albumTitle}/${photoName}`;
      const previewUrl = await s3Service.createPreSignedUrl(
        previewKey,
        S3Operations.GET_OBJECT
      );
      return Object.assign({}, album, {
        previewUrl: previewUrl,
        title: albumTitle,
        id: albumId,
        createdDate: undefined,
        dataPicker: undefined,
        location: undefined,
        photographerId: undefined,
        price: undefined,
      });
    });
    return await Promise.all(result);
  };
  getWithPhotos = async (
    albumId: string,
    personId: string
  ): Promise<AlbumDetails> => {
    const result = await albumsRepository.getById(albumId);
    if (!result) {
      throw ApiError.NotFound("Album");
    }
    const { id, createdDate } = result;
    const isPersonAssociatedToAlbum =
      await albumsRepository.isAssociatedWithPerson(personId, albumId);
    if (!isPersonAssociatedToAlbum) {
      throw AlbumError.NotBelongs(personId);
    }
    const photos = await photosService.getAlbumPhotos(albumId, personId);
    return Object.assign(result, {
      id: id,
      photos: photos,
      createdDate: format(createdDate, "yyyy-MM-dd"),
    });
  };
  getByTitle = async (title: string): Promise<AlbumInfo> => {
    const album = await albumsRepository.getByTitle(title);
    if (!album) {
      throw ApiError.NotFound("Album");
    }
    const { id, createdDate } = album;
    return Object.assign(album, {
      id: id,
      createdDate: format(createdDate, "yyyy-MM-dd"),
    });
  };
  isPersonHasAlbum = async (
    personId: string,
    albumId: string
  ): Promise<boolean> => {
    return await albumsRepository.isAssociatedWithPerson(personId, albumId);
  };
  isAlbumActivated = async (
    personId: string,
    albumId: string
  ): Promise<boolean> => {
    return await albumsRepository.isAlbumActivated(personId, albumId);
  };
  activateAlbum = async (albumId: string, clientId: string) => {
    await albumsRepository.activateAlbum(albumId, clientId);
  };
}

const albumsService = new AlbumsService();
export default albumsService;
