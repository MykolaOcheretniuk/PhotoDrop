import { date, serial, varchar } from "drizzle-orm/mysql-core/columns";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";

export const albums = mysqlTable("Albums", {
  id: serial("Id").primaryKey().notNull(),
  title: varchar("Title", { length: 256 }).notNull(),
  location: varchar("Location", { length: 100 }).notNull(),
  dataPicker: varchar("Datapicker", { length: 100 }).notNull(),
  createdDate: date("CreatedDate").notNull(),
});
export type CreateAlbum = InferModel<typeof albums, "insert">;
export type Album = InferModel<typeof albums, "select">;
