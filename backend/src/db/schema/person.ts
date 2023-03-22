import { bigint, varchar } from "drizzle-orm/mysql-core/columns";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";
import { roles } from "./role";

export const persons = mysqlTable("Persons", {
  id: varchar("Id", { length: 70 }).primaryKey().notNull(),
  email: varchar("Email", { length: 100 }),
  fullName: varchar("FullName", { length: 256 }),
  roleId: bigint("RoleId", { mode: "number" })
    .references(() => roles.id)
    .notNull(),
});
export type Person = InferModel<typeof persons,"select">