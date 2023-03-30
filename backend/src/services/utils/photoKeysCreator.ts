import { PhotoKeys } from "src/enums/photoKeys";

const createKeys = (
  albumTitle: string,
  photoName: string,
  personId: string,
  isActivated: boolean
) => {
  let baseKey = PhotoKeys.WATERMARKED_THUMBNAILS;
  let originalKey = PhotoKeys.WATERMARKED_PHOTOS;
  if (isActivated) {
    originalKey = PhotoKeys.ORIGINAL_PHOTOS;
    baseKey = PhotoKeys.THUMBNAILS;
  }
  const key = `${baseKey}/` + `${personId}/${albumTitle}/${photoName}`;
  const photoKey = `${originalKey}/` + `${personId}/${albumTitle}/${photoName}`;
  return { key: key, photoKey: photoKey };
};
export default createKeys;
