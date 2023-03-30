import { boolean, int, varchar } from "drizzle-orm/mysql-core/columns";
import { persons } from "./person";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { photos } from "./photo";
import { albums } from "./album";

export const userPhotos = mysqlTable("UserPhotos", {
  personId: varchar("PersonId", { length: 70 })
    .references(() => persons.id)
    .notNull(),
  photoId: int("PhotoId")
    .references(() => photos.id)
    .notNull(),
  albumId: varchar("AlbumId", { length: 70 })
    .references(() => albums.id)
    .notNull(),
  isActivated: boolean("IsActivated").notNull(),
});
