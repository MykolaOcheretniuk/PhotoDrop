ALTER TABLE Photos RENAME COLUMN `OriginalPhotoKey` TO `PhotoName`;
ALTER TABLE Photos ADD `AlbumTitle` varchar(256) NOT NULL;
ALTER TABLE Photos DROP COLUMN `WatermarkedPhotoKey`;
ALTER TABLE Photos DROP COLUMN `ThumbnailKey`;
ALTER TABLE Photos DROP COLUMN `WatermarkedThumbnailKey`;