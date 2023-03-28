import { randomUUID } from "crypto";
import albumsRepository from "src/db/repositories/albumsRepository";
import personsRepository from "src/db/repositories/personsRepository";
import { InsertAlbum } from "src/db/schema/album";
import { AlbumError } from "src/errors/albumError";
import { ApiError } from "src/errors/apiError";
import { AlbumDetails, AlbumInfo, CreateAlbumModel } from "src/models/albums";
import photosService from "./photoServices/photosService";
import { format } from "date-fns";

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
    };
    await albumsRepository.addNew(newAlbum);
    await albumsRepository.associateWithPerson(albumId, creatorId, true);
    return newAlbum;
  };
  getById = async (albumId: string) => {
    const existingAlbum = await albumsRepository.getById(albumId);
    if (!existingAlbum) {
      throw ApiError.NotFound("Album");
    }
    return existingAlbum;
  };
  getAll = async (photographerId: string): Promise<AlbumInfo[]> => {
    const albums = await albumsRepository.getAllPhotographerAlbums(
      photographerId
    );
    const result: AlbumInfo[] = albums.map((album) => {
      const { id, createdDate } = album;
      return Object.assign({}, album, {
        id: id,
        createdDate: format(createdDate, "yyyy-MM-dd"),
        dataPicker: undefined,
      });
    });
    return result;
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
  addClients = async (albumId: string, clientIds: string[]) => {
    const album = await albumsRepository.getById(albumId);
    if (!album) {
      throw ApiError.NotFound("Album");
    }
    for (let i = 0; i < clientIds.length; i++) {
      const client = await personsRepository.getById(clientIds[i]);
      if (!client) {
        throw ApiError.NotFound(`Client with id:${clientIds[i]}`);
      }
      await albumsRepository.associateWithPerson(albumId, clientIds[i], false);
    }
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
