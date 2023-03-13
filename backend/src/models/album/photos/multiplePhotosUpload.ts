import { UploadPhoto } from "./uploadPhoto";

export interface MultiplePhotosUpload {
  albumId: number;
  photos: UploadPhoto[];
}
