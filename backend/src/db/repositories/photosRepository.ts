import { eq } from "drizzle-orm/expressions";
import { PhotoDetails } from "src/models/photos";
import { albums } from "../schema/album";
import { personAlbums } from "../schema/personAlbum";
import { personPhotos } from "../schema/personPhoto";
import { InsertPhoto, Photo, photos } from "../schema/photo";
import { BaseRepository } from "./baseRepository";

class PhotosRepository extends BaseRepository<Photo | InsertPhoto> {
  getAlbumPhotos = async (albumId: string): Promise<Photo[]> => {
    const result = await this.db
      .select()
      .from(photos)
      .where(eq(photos.albumId, albumId));
    return result;
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
  associateWithPerson = async (personId: string, photoId: number) => {
    await this.db.insert(personPhotos).values({
      personId: personId,
      photoId: photoId,
    });
  };
}

const photosRepository = new PhotosRepository(photos);
export default photosRepository;
