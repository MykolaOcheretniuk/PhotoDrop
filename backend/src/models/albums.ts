import { PhotoModel } from "./photos";

export interface AlbumInfo {
  id: string;
  title: string;
  location: string;
  createdDate: string;
}

export interface AlbumDetails extends AlbumInfo {
  dataPicker: string;
  photos: PhotoModel[];
}

export interface CreateAlbumModel {
  title: string;
  location: string;
  dataPicker: string;
}
