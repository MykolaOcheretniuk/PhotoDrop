import { eq, and } from "drizzle-orm/expressions";
import { Album, albums, InsertAlbum } from "../schema/album";
import { photos } from "../schema/photo";
import { userPhotos } from "../schema/userPhotos";
import { BaseRepository } from "./baseRepository";

class AlbumsRepository extends BaseRepository<Album | InsertAlbum> {
  getById = async (albumId: string): Promise<Album> => {
    const album = await this.db
      .select()
      .from(albums)
      .where(eq(albums.id, albumId));
    return album[0];
  };

  getAllPhotographerAlbums = async (personId: string): Promise<Album[]> => {
    const result = await this.db
      .select()
      .from(albums)
      .where(eq(albums.photographerId, personId));
    return result;
  };
  getAllUserAlbums = async (userId: string): Promise<Album[]> => {
    const {
      id,
      title,
      location,
      dataPicker,
      createdDate,
      photographerId,
      price,
    } = albums;
    const result = await this.db
      .select({
        id,
        title,
        location,
        dataPicker,
        createdDate,
        photographerId,
        price,
      })
      .from(userPhotos)
      .innerJoin(photos, eq(photos.id, userPhotos.photoId))
      .innerJoin(albums, eq(albums.id, photos.albumId))
      .where(eq(userPhotos.personId, userId))
      .groupBy(albums.id);
    return result;
  };
  getByTitle = async (title: string): Promise<Album> => {
    const album = await this.db
      .select()
      .from(albums)
      .where(eq(albums.title, title));
    return album[0];
  };
  isAlbumActivated = async (
    personId: string,
    albumId: string
  ): Promise<boolean> => {
    const result = await this.db
      .select()
      .from(photos)
      .innerJoin(userPhotos, eq(userPhotos.photoId, photos.id))
      .where(
        and(eq(photos.albumId, albumId), eq(userPhotos.personId, personId))
      );
    if (result.length > 0) {
      return false;
    }
    const { isActivated } = result[0].UserPhotos;
    if (!isActivated) {
      return false;
    }
    return true;
  };
  isAssociatedWithPerson = async (
    personId: string,
    albumId: string
  ): Promise<boolean> => {
    const result = await this.db
      .select()
      .from(photos)
      .leftJoin(userPhotos, eq(userPhotos.photoId, photos.id))
      .where(
        and(eq(photos.albumId, albumId), eq(userPhotos.personId, personId))
      );
    if (!result[0]) {
      return false;
    }
    return true;
  };
  activateAlbum = async (albumId: string, personId: string) => {
    await this.db
      .update(userPhotos)
      .set({ isActivated: true })
      .where(
        and(eq(userPhotos.albumId, albumId), eq(userPhotos.personId, personId))
      );
  };
}

const albumsRepository = new AlbumsRepository(albums);
export default albumsRepository;
