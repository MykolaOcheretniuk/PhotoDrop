import { eq } from "drizzle-orm/expressions";
import { persons } from "../schema/person";
import { InsertUser, User, users } from "../schema/user";
import { BaseRepository } from "./baseRepository";
class UsersRepository extends BaseRepository<User | InsertUser> {
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
      .innerJoin(persons, eq(persons.id, users.personId))
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
      .innerJoin(persons, eq(persons.id, users.personId))
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
      .innerJoin(persons, eq(persons.id, users.personId))
      .where(eq(users.personId, personId));
    return result[0];
  };
  update = async (newUser: InsertUser) => {
    const { personId } = newUser;
    await this.db
      .update(users)
      .set(newUser)
      .where(eq(users.personId, personId));
  };
}
const usersRepository = new UsersRepository(users);
export default usersRepository;
