import { persons } from "../schema/person";
import { Photographer, photographers } from "../schema/photographer";
import { BaseRepository } from "./baseRepository";
import { eq } from "drizzle-orm/expressions";

class PhotographersRepository extends BaseRepository<Photographer> {
  getByLogin = async (personLogin: string): Promise<Photographer> => {
    const { passwordHash, login, personId } = photographers;
    const { email, fullName } = persons;
    const photographer = await this.db
      .select({
        personId,
        login,
        email,
        fullName,
        passwordHash,
      })
      .from(photographers)
      .innerJoin(persons, eq(persons.id, photographers.personId))
      .where(eq(photographers.login, personLogin));
    return photographer[0];
  };
}
const photographersRepository = new PhotographersRepository(photographers);
export default photographersRepository;
