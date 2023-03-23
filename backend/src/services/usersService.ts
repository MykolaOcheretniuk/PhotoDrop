import { randomUUID } from "crypto";
import personsRepository from "src/db/repositories/personsRepository";
import rolesRepository from "src/db/repositories/rolesRepository";
import usersRepository from "src/db/repositories/usersRepository";
import { InsertUser, User } from "src/db/schema/user";
import { S3Operations } from "src/enums/s3Operations";
import { ApiError } from "src/errors/apiError";
import { UploadPhoto } from "src/models/photos";
import s3Service from "./awsServices/s3Service";

class UsersService {
  getAll = async (): Promise<User[]> => {
    const users = await usersRepository.getAll();
    const userModels = users.map(async (user) => {
      const { fullName, email, phoneNumber } = user;
      if (!phoneNumber) {
        throw ApiError.IsNull(`User phone number.`);
      }
      let profilePhotoUrl = null;
      const { profilePhotoKey } = user;
      if (profilePhotoKey) {
        const url = await s3Service.createPreSignedUrl(
          profilePhotoKey,
          S3Operations.GET_OBJECT
        );
        profilePhotoUrl = url;
      }
      return Object.assign(
        {
          fullName: fullName,
          email: email,
          phoneNumber: phoneNumber,
          profilePhotoUrl: profilePhotoUrl,
        },
        user
      );
    });
    return await Promise.all(userModels);
  };
  getByPhoneNumber = async (phoneNumber: string): Promise<User> => {
    const user = await usersRepository.getByPhoneNumber(phoneNumber);
    const { fullName, email, phoneNumber: userPhoneNumber } = user;
    if (!userPhoneNumber) {
      throw ApiError.IsNull(`User phone number.`);
    }
    return Object.assign(
      {
        fullName: fullName,
        email: email,
        phoneNumber: userPhoneNumber,
        profilePhotoUrl: null,
      },
      user
    );
  };
  createNew = async (phoneNumber: string): Promise<InsertUser> => {
    const role = await rolesRepository.getByTitle("User");
    const personId = randomUUID();
    const person = {
      id: personId,
      roleId: role.id,
      email: null,
      fullName: null,
    };
    await personsRepository.addNew(person);
    const user = {
      personId: personId,
      profilePhotoKey: null,
      phoneNumber: phoneNumber,
    };
    await usersRepository.addNew(user);
    return user;
  };
  uploadSelfie = async (photo: UploadPhoto, userId: string) => {
    const user = await usersRepository.getById(userId);
    if (!user) {
      throw ApiError.NotFound("User");
    }
    const { personId, phoneNumber } = user;
    if (!personId) {
      throw ApiError.IsNull("personId");
    }
    const { name, type, data } = photo;
    const key = `selfies/${userId}/${name}`;
    const newUser: InsertUser = {
      personId: personId,
      phoneNumber: phoneNumber,
      profilePhotoKey: key,
    };
    const buffer = Buffer.from(data, "base64");
    await usersRepository.update(newUser);
    await s3Service.uploadImage(buffer, key, type);
  };
  updateEmail = async (email:string) => {};
}

const usersService = new UsersService();
export default usersService;
