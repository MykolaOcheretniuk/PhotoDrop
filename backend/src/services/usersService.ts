import usersRepository from "src/db/repositories/usersRepository";
import { ApiError } from "src/errors/apiError";
import { UserModel } from "src/models/userModel";

class UsersService {
  getAll = async (): Promise<UserModel[]> => {
    const users = await usersRepository.getAll();
    const userModels: UserModel[] = users.map((user) => {
      const { fullName, email, phoneNumber } = user;
      if (!fullName || !email || !phoneNumber) {
        throw ApiError.IsNull("User");
      }
      return Object.assign(
        {
          fullName: fullName,
          email: email,
          phoneNumber: phoneNumber,
        },
        user
      );
    });
    return userModels;
  };
}

const usersService = new UsersService();
export default usersService;
