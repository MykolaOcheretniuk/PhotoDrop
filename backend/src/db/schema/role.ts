import {  serial, varchar } from "drizzle-orm/mysql-core/columns";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";

export const roles = mysqlTable("Roles", {
  id: serial("Id").primaryKey().notNull(),
  title: varchar("Title", { length: 100 }).notNull(),
});
export type Role = InferModel<typeof roles,"select">