import { and, eq } from "drizzle-orm/expressions";
import { Album } from "src/entities/album";
import { AlbumInfo } from "src/models/album/album";
import { albums } from "../schema/album";
import { personAlbums } from "../schema/personAlbum";
import { BaseRepository } from "./baseRepository";

class AlbumsRepository extends BaseRepository<Album> {
  getById = async (albumId: number): Promise<Album> => {
    const album = await this.db
      .select()
      .from(albums)
      .where(eq(albums.id, albumId));
    return album[0];
  };
  associateWithPerson = async (
    albumId: number,
    personId: string,
    isActivated: boolean
  ) => {
    await this.db.insert(personAlbums).values({
      personId: personId,
      albumId: albumId,
      isActivated: isActivated,
    });
  };
  getAllPhotographerAlbums = async (personId: string): Promise<AlbumInfo[]> => {
    const result = await this.db
      .select({
        id: albums.id,
        title: albums.title,
        location: albums.location,
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
    albumId: number
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
}

const albumsRepository = new AlbumsRepository(albums);
export default albumsRepository;
