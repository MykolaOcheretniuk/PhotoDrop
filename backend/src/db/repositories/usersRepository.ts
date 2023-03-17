import { eq } from "drizzle-orm/expressions";
import { User } from "src/entities/user";
import { persons } from "../schema/person";
import { users } from "../schema/user";
import { BaseRepository } from "./baseRepository";
import { CreateUserDto } from "src/models/dto/createUserDto";
class UsersRepository extends BaseRepository<User | CreateUserDto> {
  getAll = async (): Promise<User[]> => {
    const result = await this.db
      .select({
        personId: persons.id,
        email: persons.email,
        fullName: persons.fullName,
        profilePhotoKey: users.profilePhotoKey,
        phoneNumber: users.phoneNumber,
      })
      .from(users)
      .leftJoin(persons, eq(persons.id, users.personId))
      .where(eq(persons.roleId, 1));
    return result;
  };
  getByPhoneNumber = async (phoneNumber: string): Promise<User> => {
    const result = await this.db
      .select({
        personId: persons.id,
        email: persons.email,
        fullName: persons.fullName,
        profilePhotoKey: users.profilePhotoKey,
        phoneNumber: users.phoneNumber,
      })
      .from(users)
      .leftJoin(persons, eq(persons.id, users.personId))
      .where(eq(users.phoneNumber, phoneNumber));
    return result[0];
  };
  getById = async (personId: string): Promise<User> => {
    const result = await this.db
      .select({
        personId: persons.id,
        email: persons.email,
        fullName: persons.fullName,
        profilePhotoKey: users.profilePhotoKey,
        phoneNumber: users.phoneNumber,
      })
      .from(users)
      .leftJoin(persons, eq(persons.id, users.personId))
      .where(eq(users.personId, personId));
    return result[0];
  };
  update = async (newUser: CreateUserDto) => {
    const { personId } = newUser;
    await this.db
      .update(users)
      .set(newUser)
      .where(eq(users.personId, personId));
  };
}
const usersRepository = new UsersRepository(users);
export default usersRepository;
