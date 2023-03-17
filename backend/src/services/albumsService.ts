import albumsRepository from "src/db/repositories/albumsRepository";
import personsRepository from "src/db/repositories/personsRepository";
import { Album } from "src/entities/album";
import { AlbumError } from "src/errors/albumError";
import { ApiError } from "src/errors/apiError";
import { AlbumInfo } from "src/models/album/album";
import { AlbumDetails } from "src/models/album/albumDetails";
import { CreateAlbumModel } from "src/models/album/createAlbumModel";
import photosService from "./photoServices/photosService";

class AlbumsService {
  create = async (albumModel: CreateAlbumModel, creatorId: string) => {
    const { title, location, dataPicker } = albumModel;
    const newAlbum: Album = {
      title: title,
      location: location,
      dataPicker: dataPicker,
    };
    const insertResult = await albumsRepository.addNew(newAlbum);
    const { insertId: albumId } = insertResult[0];
    await albumsRepository.associateWithPerson(albumId, creatorId, true);
    return insertResult;
  };
  getAll = async (photographerId: string): Promise<AlbumInfo[]> => {
    const result = await albumsRepository.getAllPhotographerAlbums(
      photographerId
    );
    return result;
  };
  getById = async (
    albumId: number,
    personId: string
  ): Promise<AlbumDetails> => {
    const result = await albumsRepository.getById(albumId);
    if (!result) {
      throw ApiError.NotFound("Album");
    }
    const { id } = result;
    if (!id) {
      throw AlbumError.IncorrectValue("Id");
    }
    const isPersonAssociatedToAlbum =
      await albumsRepository.isAssociatedWithPerson(personId, albumId);
    if (!isPersonAssociatedToAlbum) {
      throw AlbumError.NotBelongs(personId);
    }
    const photos = await photosService.getAlbumPhotos(albumId, personId);
    return Object.assign(result, { id: id, photos: photos });
  };
  getByTitle = async (title: string): Promise<AlbumInfo> => {
    const album = await albumsRepository.getByTitle(title);
    if (!album) {
      throw ApiError.NotFound("Album");
    }
    const { id } = album;
    if (!id) {
      throw AlbumError.IncorrectValue("Id");
    }
    return Object.assign(album, { id: id });
  };
  addClients = async (albumId: number, clientIds: string[]) => {
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
}

const albumsService = new AlbumsService();
export default albumsService;
