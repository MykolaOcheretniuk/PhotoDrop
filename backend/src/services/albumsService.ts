import albumsRepository from "src/db/repositories/albumsRepository";
import { Album } from "src/entities/album";
import { AlbumError } from "src/errors/albumError";
import { ApiError } from "src/errors/apiError";
import { AlbumInfo } from "src/models/album/album";
import { AlbumDetails } from "src/models/album/albumDetails";
import { CreateAlbumModel } from "src/models/album/createAlbumModel";

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
    await albumsRepository.associateWithPerson(albumId, creatorId);
    return insertResult;
  };
  getAll = async (photographerId: string): Promise<AlbumInfo[]> => {
    const result = await albumsRepository.getAllPhotographerAlbums(
      photographerId
    );
    return result;
  };
  getById = async (albumId: number): Promise<AlbumDetails> => {
    const result = await albumsRepository.getById(albumId);
    if (!result) {
      throw ApiError.NotFound("Album");
    }
    const { id } = result;
    if (!id) {
      throw AlbumError.IncorrectValue("Id");
    }
    return Object.assign(result, { id: id });
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
}

const albumsService = new AlbumsService();
export default albumsService;
