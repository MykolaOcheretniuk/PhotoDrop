ALTER TABLE Photos ADD `OriginalPhotoKey` varchar(256) NOT NULL;
ALTER TABLE Photos ADD `WatermarkedPhotoKey` varchar(256) NOT NULL;
ALTER TABLE Photos ADD `ThumbnailKey` varchar(256) NOT NULL;
ALTER TABLE Photos ADD `WatermarkedThumbnailKey` varchar(256) NOT NULL;
ALTER TABLE Photos DROP COLUMN `OriginalPhotoURL`;
ALTER TABLE Photos DROP COLUMN `WatermarkedPhotoURL`;