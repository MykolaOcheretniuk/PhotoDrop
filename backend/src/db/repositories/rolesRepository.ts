import { eq } from "drizzle-orm/expressions";
import { persons } from "../schema/person";
import { Role, roles } from "../schema/role";
import { BaseRepository } from "./baseRepository";

class RolesRepository extends BaseRepository<Role> {
  personRole = async (personId: string): Promise<Role> => {
    const role = await this.db
      .select({
        id: roles.id,
        title: roles.title,
      })
      .from(roles)
      .leftJoin(persons, eq(roles.id, persons.roleId))
      .where(eq(persons.id, personId));
    return role[0];
  };
  getByTitle = async (roleTitle: string): Promise<Role> => {
    const result = await this.db
      .select()
      .from(roles)
      .where(eq(roles.title, roleTitle));
    return result[0];
  };
}
const rolesRepository = new RolesRepository(persons);
export default rolesRepository;
