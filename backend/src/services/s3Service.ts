import * as AWS from "aws-sdk";
import { ApiError } from "src/errors/apiError";
import { EditedPhotoDto } from "src/models/dto/editedPhotoDto";

class S3Service {
  private s3 = new AWS.S3();
  private bucket = process.env.BUCKET_NAME as string;
  createPreSignedUrl = async (key: string) => {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: 3000,
    };
    const url = await this.s3.getSignedUrlPromise("putObject", params);
    return url;
  };
  getImageBuffer = async (fileKey: string): Promise<Buffer> => {
    const image = await this.s3
      .getObject({ Bucket: this.bucket, Key: fileKey })
      .promise();
    const { Body: result } = image;
    if (!result) {
      throw ApiError.NotFound("Photo");
    }
    return result as Buffer;
  };
  uploadImage = async (
    imageBuffer: Buffer,
    key: string,
    contentType: string
  ) => {
    await this.s3
      .upload({
        Bucket: this.bucket,
        Key: key,
        Body: imageBuffer,
        ContentType: contentType,
      })
      .promise();
  };
  uploadEditedPhotos = async (photos: EditedPhotoDto[], keys: string[]) => {
    let i = 0;
    const promises = photos.map(async (file) => {
      const { buffer, mime } = file;
      const key = keys[i];
      i++;
      await this.uploadImage(buffer, key, mime);
    });
    await Promise.all(promises);
  };
}
const s3Service = new S3Service();
export default s3Service;
