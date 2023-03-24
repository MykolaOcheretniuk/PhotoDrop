import { eq } from "drizzle-orm/expressions";
import { InsertPerson, Person, persons } from "../schema/person";
import { BaseRepository } from "./baseRepository";

class PersonsRepository extends BaseRepository<Person | InsertPerson> {
  getById = async (personId: string): Promise<Person> => {
    const result = await this.db
      .select()
      .from(persons)
      .where(eq(persons.id, personId));
    return result[0];
  };
  update = async (person: InsertPerson) => {
    const { id } = person;
    return await this.db.update(persons).set(person).where(eq(persons.id, id));
  };
}
const personsRepository = new PersonsRepository(persons);
export default personsRepository;
