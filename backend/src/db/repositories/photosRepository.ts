import { Photo } from "src/entities/photo";
import { photos } from "../schema/photo";
import { BaseRepository } from "./baseRepository";

class PhotosRepository extends BaseRepository<Photo> {

    

}

const photosRepository = new PhotosRepository(photos);
export default photosRepository;
