import { int, varchar } from "drizzle-orm/mysql-core/columns";
import { persons } from "./person";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { photos } from "./photo";

export const personPhotos = mysqlTable("PersonPhotos", {
  personId: varchar("PersonId", { length: 70 })
    .references(() => persons.id)
    .notNull(),
  photoId: int("PhotoId")
    .references(() => photos.id)
    .notNull(),
});
