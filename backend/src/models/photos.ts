export interface UploadPhoto {
  name: string;
  type: string;
  data: string;
  usersPhoneNumbers : string[];
}

export interface PhotoDetails {
  id: number;
  albumId: string;
  albumTitle: string;
  photoName: string;
  isActivated: boolean;
}

export interface PhotoModel {
  id: number;
  thumbnailUrl: string;
  originalUrl: string;
}

export interface MultiplePhotosUpload {
  albumId: number;
  photos: UploadPhoto[];
}
