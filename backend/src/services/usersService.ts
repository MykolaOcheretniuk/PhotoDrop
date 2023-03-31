import { randomUUID } from "crypto";
import personsRepository from "src/db/repositories/personsRepository";
import rolesRepository from "src/db/repositories/rolesRepository";
import usersRepository from "src/db/repositories/usersRepository";
import { InsertPerson } from "src/db/schema/person";
import { InsertUser, User } from "src/db/schema/user";
import { ApiError } from "src/errors/apiError";
import { UploadPhoto } from "src/models/photos";
import s3Service from "./awsServices/s3Service";

class UsersService {
  getAllNumbers = async (): Promise<string[]> => {
    const users = await usersRepository.getAll();
    const numbers = users.map(async (user) => {
      return user.phoneNumber;
    });
    return await Promise.all(numbers);
  };
  getByPhoneNumber = async (phoneNumber: string): Promise<User> => {
    const user = await usersRepository.getByPhoneNumber(phoneNumber);
    const { fullName, email, phoneNumber: userPhoneNumber } = user;
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
  updateEmail = async (email: string, personId: string) => {
    const user = await personsRepository.getById(personId);
    if (!user) {
      throw ApiError.NotFound("User");
    }
    const newUser: InsertPerson = Object.assign(user, { email: email });
    await personsRepository.update(newUser);
  };
  updateName = async (name: string, personId: string) => {
    const user = await personsRepository.getById(personId);
    if (!user) {
      throw ApiError.NotFound("User");
    }
    const newUser: InsertPerson = Object.assign(user, { fullName: name });
    await personsRepository.update(newUser);
  };
}

const usersService = new UsersService();
export default usersService;
