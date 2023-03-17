dry run
ALTER TABLE Users ADD `ProfilePhotoKey` varchar(256);
ALTER TABLE Users DROP COLUMN `ProfilePhotoURL`;