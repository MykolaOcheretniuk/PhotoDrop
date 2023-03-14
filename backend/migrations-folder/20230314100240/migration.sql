ALTER TABLE PersonAlbums ADD `IsActivated` boolean NOT NULL;
ALTER TABLE Photos DROP COLUMN `IsActivated`;