import { eq, and } from "drizzle-orm/expressions";
import { PhotoDetails } from "src/models/photos/photoDetails";
import { albums } from "../schema/album";
import { personAlbums } from "../schema/personAlbum";
import { CreatePhoto, Photo, photos } from "../schema/photo";
import { BaseRepository } from "./baseRepository";

class PhotosRepository extends BaseRepository<Photo | CreatePhoto> {
  getAlbumPhotos = async (albumId: number): Promise<Photo[]> => {
    const result = await this.db
      .select()
      .from(photos)
      .where(eq(photos.albumId, albumId));
    return result;
  };
  getByNameInAlbum = async (name: string, albumId: number): Promise<Photo> => {
    const result = await this.db
      .select()
      .from(photos)
      .where(and(eq(photos.photoName, name), eq(photos.albumId, albumId)));
    return result[0];
  };
  getById = async (id: number): Promise<Photo> => {
    const result = await this.db.select().from(photos).where(eq(photos.id, id));
    return result[0];
  };
  getAllPersonPhotos = async (personId: string): Promise<PhotoDetails[]> => {
    const result = await this.db
      .select({
        id: photos.id,
        albumId: photos.albumId,
        albumTitle: photos.albumTitle,
        photoName: photos.photoName,
        isActivated: personAlbums.isActivated,
      })
      .from(photos)
      .leftJoin(albums, eq(albums.id, photos.albumId))
      .leftJoin(personAlbums, eq(personAlbums.albumId, albums.id))
      .where(eq(personAlbums.personId, personId));
    return result;
  };
}

const photosRepository = new PhotosRepository(photos);
export default photosRepository;
