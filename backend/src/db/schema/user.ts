import { varchar } from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { persons } from "./person";

export const users = mysqlTable("Users", {
  personId: varchar("PersonId", { length: 70 })
    .references(() => persons.id)
    .notNull()
    .primaryKey(),
  profilePhotoURL: varchar("ProfilePhotoURL", { length: 256 }),
  phoneNumber: varchar("PhoneNumber", { length: 100 }),
});
