import { eq } from "drizzle-orm/expressions";
import { Photo } from "src/entities/photo";
import { photos } from "../schema/photo";
import { BaseRepository } from "./baseRepository";

class PhotosRepository extends BaseRepository<Photo> {
  getAlbumPhotos = async (albumId: number): Promise<Photo[]> => {
    const result = await this.db
      .select()
      .from(photos)
      .where(eq(photos.albumId, albumId));
    return result;
  };
}

const photosRepository = new PhotosRepository(photos);
export default photosRepository;
