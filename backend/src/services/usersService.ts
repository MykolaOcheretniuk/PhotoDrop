import { randomUUID } from "crypto";
import personsRepository from "src/db/repositories/personsRepository";
import rolesRepository from "src/db/repositories/rolesRepository";
import usersRepository from "src/db/repositories/usersRepository";
import { InsertPerson } from "src/db/schema/person";
import { InsertUser } from "src/db/schema/user";
import { S3Operations } from "src/enums/s3Operations";
import { ApiError } from "src/errors/apiError";
import { UploadPhoto } from "src/models/photos";
import { UserModel } from "src/models/users";
import s3Service from "./awsServices/s3Service";

class UsersService {
  getAllNumbers = async (): Promise<string[]> => {
    const users = await usersRepository.getAll();
    const numbers = users.map(async (user) => {
      return user.phoneNumber;
    });
    return await Promise.all(numbers);
  };
  getById = async (id: string): Promise<UserModel> => {
    const user = await usersRepository.getById(id);
    return Object.assign({}, user, {
      phoneNumber: undefined,
      profilePhotoKey: undefined,
    });
  };
  getSelfie = async (id: string): Promise<string | null> => {
    const { profilePhotoKey } = await usersRepository.getById(id);
    if (!profilePhotoKey) {
      return null;
    }
    const profilePhotoUrl = await s3Service.createPreSignedUrl(
      profilePhotoKey,
      S3Operations.GET_OBJECT
    );
    return profilePhotoUrl;
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
  uploadSelfie = async (
    photo: UploadPhoto,
    userId: string
  ): Promise<string> => {
    const user = await usersRepository.getById(userId);
    if (!user) {
      throw ApiError.NotFound("User");
    }
    const { personId, phoneNumber } = user;
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
    const selfieUrl = await s3Service.createPreSignedUrl(
      key,
      S3Operations.GET_OBJECT
    );
    return selfieUrl;
  };
  updateEmail = async (email: string, personId: string) => {
    const user = await personsRepository.getById(personId);
    if (!user) {
      throw ApiError.NotFound("User");
    }
    const newUser: InsertPerson = Object.assign(user, { email: email });
    await personsRepository.update(newUser);
    return email;
  };
  updateName = async (name: string, personId: string) => {
    const user = await personsRepository.getById(personId);
    if (!user) {
      throw ApiError.NotFound("User");
    }
    const newUser: InsertPerson = Object.assign(user, { fullName: name });
    await personsRepository.update(newUser);
    return name;
  };
}

const usersService = new UsersService();
export default usersService;
