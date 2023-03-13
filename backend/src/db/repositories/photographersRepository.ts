import { Photographer } from "src/entities/photographer";
import { persons } from "../schema/person";
import { photographers } from "../schema/photographer";
import { BaseRepository } from "./baseRepository";
import { eq } from "drizzle-orm/expressions";

class PhotographersRepository extends BaseRepository<Photographer> {
  getByLogin = async (login: string): Promise<Photographer> => {
    const photographer = await this.db
      .select({
        personId: photographers.personId,
        login: photographers.login,
        email: persons.email,
        fullName: persons.fullName,
        passwordHash: photographers.passwordHash,
      })
      .from(this.table)
      .leftJoin(persons, eq(persons.id, photographers.personId))
      .where(eq(photographers.login, login));
    return photographer[0];
  };
}
const photographersRepository = new PhotographersRepository(photographers);
export default photographersRepository;
