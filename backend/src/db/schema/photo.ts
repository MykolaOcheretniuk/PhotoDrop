import {
  bigint,
  boolean,
  serial,
  varchar,
} from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { albums } from "./album";

export const photos = mysqlTable("Photos", {
  id: serial("Id").primaryKey().notNull(),
  albumId: bigint("AlbumId", { mode: "number" })
    .references(() => albums.id)
    .notNull(),
  isActivated: boolean("IsActivated").notNull(),
  originalPhotoKey: varchar("OriginalPhotoKey", { length: 256 }).notNull(),
  watermarkedPhotoKey: varchar("WatermarkedPhotoKey", {
    length: 256,
  }).notNull(),
  thumbnailKey: varchar("ThumbnailKey", { length: 256 }).notNull(),
  watermarkedThumbnailKey: varchar("WatermarkedThumbnailKey", {
    length: 256,
  }).notNull(),
});
