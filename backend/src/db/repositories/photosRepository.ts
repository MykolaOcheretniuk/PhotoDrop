import { eq, and } from "drizzle-orm/expressions";
import { PhotoDetails } from "src/models/photos";
import { InsertPhoto, Photo, photos } from "../schema/photo";
import { userPhotos } from "../schema/userPhotos";
import { BaseRepository } from "./baseRepository";

class PhotosRepository extends BaseRepository<Photo | InsertPhoto> {
  getAlbumPhotos = async (
    albumId: string,
    userId: string
  ): Promise<PhotoDetails[]> => {
    const result = await this.db
      .select({
        id: photos.id,
        albumId: photos.albumId,
        albumTitle: photos.albumTitle,
        photoName: photos.photoName,
        isActivated: userPhotos.isActivated,
      })
      .from(photos)
      .innerJoin(userPhotos, eq(userPhotos.photoId, photos.id))
      .where(and(eq(photos.albumId, albumId), eq(userPhotos.personId, userId)));
    return result;
  };
  getAllUserPhotos = async (personId: string): Promise<PhotoDetails[]> => {
    const result = await this.db
      .select({
        id: photos.id,
        albumId: photos.albumId,
        albumTitle: photos.albumTitle,
        photoName: photos.photoName,
        isActivated: userPhotos.isActivated,
      })
      .from(photos)
      .innerJoin(userPhotos, eq(userPhotos.photoId, photos.id))
      .where(eq(userPhotos.personId, personId));
    return result;
  };
  getFirstAlbumPhoto = async (albumId: string): Promise<Photo> => {
    const result = await this.db
      .select()
      .from(photos)
      .where(eq(photos.albumId, albumId));
    return result[0];
  };
  associateWithUser = async (
    personId: string,
    photoId: number,
    albumId: string
  ) => {
    await this.db.insert(userPhotos).values({
      personId: personId,
      photoId: photoId,
      isActivated: false,
      albumId: albumId,
    });
  };
}

const photosRepository = new PhotosRepository(photos);
export default photosRepository;
