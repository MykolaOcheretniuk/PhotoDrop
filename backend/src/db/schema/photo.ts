import { bigint, serial, varchar } from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { albums } from "./album";

export const photos = mysqlTable("Photos", {
  id: serial("Id").primaryKey().notNull(),
  albumId: bigint("AlbumId", { mode: "number" })
    .references(() => albums.id)
    .notNull(),
  albumTitle: varchar("AlbumTitle", { length: 256 }).notNull(),
  photoName: varchar("PhotoName", {
    length: 256,
  }).notNull(),
});
