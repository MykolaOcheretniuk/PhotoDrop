import { PhotoModel } from "../photos/photo";

export interface AlbumDetails {
  id: number;
  title: string;
  location: string;
  dataPicker: string;
  photos: PhotoModel[];
}
