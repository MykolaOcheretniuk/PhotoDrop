export interface Photo
{
    id?:number,
    albumId: number,
    originalPhotoKey: string,
    watermarkedPhotoKey: string,
    thumbnailKey: string,
    watermarkedThumbnailKey:string,
}