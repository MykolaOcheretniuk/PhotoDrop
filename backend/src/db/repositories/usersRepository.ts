import { eq } from "drizzle-orm/expressions";
import { User } from "src/entities/user";
import { persons } from "../schema/person";
import { users } from "../schema/user";
import { BaseRepository } from "./baseRepository";

class UsersRepository extends BaseRepository<User> {
  getAll = async (): Promise<User[]> => {
    const result = await this.db
      .select({
        personId: persons.id,
        email: persons.email,
        fullName: persons.fullName,
        profilePhotoUrl: users.profilePhotoURL,
        phoneNumber: users.phoneNumber,
      })
      .from(persons)
      .leftJoin(users, eq(persons.id, users.personId))
      .where(eq(persons.roleId, 1));
    return result;
  };
}
const usersRepository = new UsersRepository(users);
export default usersRepository;
