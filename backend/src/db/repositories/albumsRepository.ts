import { and, eq } from "drizzle-orm/expressions";
import { Album, albums, InsertAlbum } from "../schema/album";
import { personAlbums } from "../schema/personAlbum";
import { BaseRepository } from "./baseRepository";

class AlbumsRepository extends BaseRepository<Album | InsertAlbum> {
  getById = async (albumId: string): Promise<Album> => {
    const album = await this.db
      .select()
      .from(albums)
      .where(eq(albums.id, albumId));
    return album[0];
  };
  associateWithPerson = async (
    albumId: string,
    personId: string,
    isActivated: boolean
  ) => {
    await this.db.insert(personAlbums).values({
      personId: personId,
      albumId: albumId,
      isActivated: isActivated,
    });
  };
  getAllPhotographerAlbums = async (personId: string): Promise<Album[]> => {
    const result = await this.db
      .select({
        id: albums.id,
        title: albums.title,
        location: albums.location,
        createdDate: albums.createdDate,
        dataPicker: albums.dataPicker,
      })
      .from(albums)
      .leftJoin(personAlbums, eq(personAlbums.albumId, albums.id))
      .where(eq(personAlbums.personId, personId));
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
      .select({
        isActivated: personAlbums.isActivated,
      })
      .from(personAlbums)
      .where(
        and(
          eq(personAlbums.personId, personId),
          eq(personAlbums.albumId, albumId)
        )
      );
    const { isActivated } = result[0];
    return isActivated;
  };
  isAssociatedWithPerson = async (
    personId: string,
    albumId: string
  ): Promise<boolean> => {
    const result = await this.db
      .select()
      .from(personAlbums)
      .where(
        and(
          eq(personAlbums.personId, personId),
          eq(personAlbums.albumId, albumId)
        )
      );
    if (result[0]) {
      return true;
    }
    return false;
  };
  activateAlbum = async (albumId: string, personId: string) => {
    await this.db
      .update(personAlbums)
      .set({
        isActivated: true,
      })
      .where(
        and(
          eq(personAlbums.albumId, albumId),
          eq(personAlbums.personId, personId)
        )
      );
  };
}

const albumsRepository = new AlbumsRepository(albums);
export default albumsRepository;
