import { randomUUID } from "crypto";
import albumsRepository from "src/db/repositories/albumsRepository";
import personsRepository from "src/db/repositories/personsRepository";
import usersRepository from "src/db/repositories/usersRepository";
import { InsertPerson } from "src/db/schema/person";
import { InsertUser } from "src/db/schema/user";
import { PhotoKeys } from "src/enums/photoKeys";
import { ApiError } from "src/errors/apiError";
import { UploadPhoto } from "src/models/photos";
import s3Service from "../awsServices/s3Service";

export class PhotosUploader {
  uploadMany = async (photos: UploadPhoto[], albumId: string) => {
    const album = await albumsRepository.getById(albumId);
    if (!album) {
      throw ApiError.NotFound("Album");
    }
    const promises = photos.map(async (photo) => {
      const { data, name, type, usersPhoneNumbers } = photo;
      for (let i = 0; i < usersPhoneNumbers.length; i++) {
        const number = usersPhoneNumbers[i];
        const user = await usersRepository.getByPhoneNumber(number);
        if (!user) {
          const userId = randomUUID();
          const newUser: InsertUser = {
            personId: userId,
            profilePhotoKey: null,
            phoneNumber: number,
          };
          const newPerson: InsertPerson = {
            id: userId,
            roleId: 1,
          };
          await personsRepository.addNew(newPerson);
          await usersRepository.addNew(newUser);
          const key = `${PhotoKeys.ORIGINAL_PHOTOS}/${userId}/${album.title}/${name}`;
          const buffer = Buffer.from(data, "base64");
          await s3Service.uploadImage(buffer, key, type);
          continue;
        }
        const { personId: userId } = user;
        const key = `${PhotoKeys.ORIGINAL_PHOTOS}/${userId}/${album.title}/${name}`;
        const buffer = Buffer.from(data, "base64");
        await s3Service.uploadImage(buffer, key, type);
        continue;
      }
    });
    await Promise.all(promises);
  };
}
const photosUploader = new PhotosUploader();
export default photosUploader;
