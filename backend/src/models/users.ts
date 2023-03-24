import { User } from "src/db/schema/user";

export interface AddClientsToAlbum {
  albumId: number;
  clients: string[];
}

export interface LoginAndRegistrationModel {
  confirmationCode: string;
  phoneNumber: string;
}

export type UserModel = Omit<User, "profilePhotoKey">;
