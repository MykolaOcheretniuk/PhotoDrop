import { date, varchar } from "drizzle-orm/mysql-core/columns";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";

export const albums = mysqlTable("Albums", {
  id: varchar("Id", { length: 100 }).primaryKey().notNull(),
  title: varchar("Title", { length: 256 }).notNull(),
  location: varchar("Location", { length: 100 }).notNull(),
  dataPicker: varchar("Datapicker", { length: 100 }).notNull(),
  createdDate: date("CreatedDate").notNull(),
});
export type InsertAlbum = InferModel<typeof albums, "insert">;
export type Album = InferModel<typeof albums, "select">;
