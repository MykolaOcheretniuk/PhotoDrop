import { boolean, varchar } from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { albums } from "./album";
import { persons } from "./person";

export const personAlbums = mysqlTable("PersonAlbums", {
  personId: varchar("PersonId", { length: 70 })
    .references(() => persons.id)
    .notNull(),
  albumId: varchar("AlbumId", { length: 70 })
    .references(() => albums.id)
    .notNull(),
  isActivated: boolean("IsActivated").notNull(),
});
