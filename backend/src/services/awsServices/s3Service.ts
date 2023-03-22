import * as AWS from "aws-sdk";
import { S3Operations } from "src/enums/s3Operations";
import { ApiError } from "src/errors/apiError";
import { EditedPhotoDto } from "src/models/dto/editedPhotoDto";
import getEnv from "../utils/getEnv";

class S3Service {
  private s3 = new AWS.S3();
  private bucket = getEnv("BUCKET_NAME") as string;
  createPreSignedUrl = async (key: string, operation: S3Operations) => {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: 3000,
    };
    const url = await this.s3.getSignedUrlPromise(operation, params);
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
