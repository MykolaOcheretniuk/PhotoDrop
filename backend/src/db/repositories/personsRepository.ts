import { eq } from "drizzle-orm/expressions";
import { Person, persons } from "../schema/person";
import { BaseRepository } from "./baseRepository";

class PersonsRepository extends BaseRepository<Person> {
  getById = async (personId: string): Promise<Person> => {
    const result = await this.db
      .select()
      .from(persons)
      .where(eq(persons.id, personId));
    return result[0];
  };
}
const personsRepository = new PersonsRepository(persons);
export default personsRepository;
