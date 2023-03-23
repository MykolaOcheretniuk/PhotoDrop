export interface UploadPhoto {
  name: string;
  type: string;
  data: string;
}

export interface PhotoDetails {
  id: number;
  albumId: string;
  albumTitle: string;
  photoName: string;
  isActivated: boolean | null;
}

export interface PhotoModel {
  id: number;
  url: string;
}

export interface MultiplePhotosUpload {
  albumId: number;
  photos: UploadPhoto[];
}
