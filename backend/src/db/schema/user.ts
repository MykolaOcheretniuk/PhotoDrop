import { varchar } from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { persons } from "./person";

export const users = mysqlTable("Users", {
  personId: varchar("PersonId", { length: 70 })
    .references(() => persons.id)
    .notNull()
    .primaryKey(),
  profilePhotoKey: varchar("ProfilePhotoKey", { length: 256 }),
  phoneNumber: varchar("PhoneNumber", { length: 100 }).notNull(),
});
