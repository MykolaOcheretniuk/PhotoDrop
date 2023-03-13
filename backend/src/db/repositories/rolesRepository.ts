import { eq } from "drizzle-orm/expressions";
import { Role } from "src/entities/role";
import { persons } from "../schema/person";
import { roles } from "../schema/role";
import { BaseRepository } from "./baseRepository";

class RolesRepository extends BaseRepository<Role> {
  personRole = async (personId: string): Promise<Role> => {
    const role = await this.db
      .select({
        id: roles.id,
        title: roles.title,
      })
      .from(persons)
      .leftJoin(roles, eq(roles.id, persons.roleId))
      .where(eq(persons.id, personId));
    return role[0];
  };
}
const rolesRepository = new RolesRepository(persons);
export default rolesRepository;