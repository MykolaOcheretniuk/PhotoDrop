import { bigint, varchar } from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { albums } from "./album";
import { persons } from "./person";

export const personAlbums = mysqlTable("PersonAlbums", {
  personId: varchar("PersonId", { length: 70 })
    .references(() => persons.id)
    .notNull(),
  albumId: bigint("AlbumId", { mode: "number" })
    .references(() => albums.id)
    .notNull(),
});
