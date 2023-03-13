export interface Photo
{
    id?:number,
    albumId: number,
    isActivated: boolean,
    originalPhotoKey: string,
    watermarkedPhotoKey: string,
    thumbnailKey: string,
    watermarkedThumbnailKey:string,
}