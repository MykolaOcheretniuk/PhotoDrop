CREATE TABLE `Albums` (
	`Id` serial PRIMARY KEY NOT NULL,
	`Title` varchar(256) NOT NULL,
	`Location` varchar(100) NOT NULL,
	`Datapicker` varchar(100) NOT NULL
);

CREATE TABLE `Persons` (
	`Id` varchar(70) PRIMARY KEY NOT NULL,
	`Email` varchar(100),
	`FullName` varchar(256),
	`RoleId` int NOT NULL
);

CREATE TABLE `PersonAlbums` (
	`PersonId` varchar(70) NOT NULL,
	`AlbumId` serial NOT NULL
);

CREATE TABLE `Photos` (
	`Id` serial PRIMARY KEY NOT NULL,
	`AlbumId` int NOT NULL,
	`IsActivated` boolean NOT NULL,
	`OriginalPhotoURL` varchar(256) NOT NULL,
	`WatermarkedPhotoURL` varchar(256) NOT NULL
);

CREATE TABLE `Photographers` (
	`PersonId` varchar(70) PRIMARY KEY NOT NULL,
	`Login` varchar(256),
	`PasswordHash` varchar(256) NOT NULL
);

CREATE TABLE `Roles` (
	`Id` serial PRIMARY KEY NOT NULL,
	`title` varchar(100) NOT NULL
);

CREATE TABLE `Users` (
	`PersonId` varchar(70) PRIMARY KEY NOT NULL,
	`ProfilePhotoURL` varchar(256),
	`PhoneNumber` varchar(100)
);

ALTER TABLE Persons ADD CONSTRAINT Persons_RoleId_Roles_Id_fk FOREIGN KEY (`RoleId`) REFERENCES Roles(`Id`) ;
ALTER TABLE PersonAlbums ADD CONSTRAINT PersonAlbums_PersonId_Persons_Id_fk FOREIGN KEY (`PersonId`) REFERENCES Persons(`Id`) ;
ALTER TABLE PersonAlbums ADD CONSTRAINT PersonAlbums_AlbumId_Albums_Id_fk FOREIGN KEY (`AlbumId`) REFERENCES Albums(`Id`) ;
ALTER TABLE Photos ADD CONSTRAINT Photos_AlbumId_Albums_Id_fk FOREIGN KEY (`AlbumId`) REFERENCES Albums(`Id`) ;
ALTER TABLE Photographers ADD CONSTRAINT Photographers_PersonId_Persons_Id_fk FOREIGN KEY (`PersonId`) REFERENCES Persons(`Id`) ;
ALTER TABLE Users ADD CONSTRAINT Users_PersonId_Persons_Id_fk FOREIGN KEY (`PersonId`) REFERENCES Persons(`Id`) ;