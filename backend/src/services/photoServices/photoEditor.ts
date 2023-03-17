import Jimp from "jimp";
import { ApiError } from "src/errors/apiError";
import { EditedPhotoDto } from "src/models/dto/editedPhotoDto";
class PhotoEditor {
  private watermark: Jimp | null;
  constructor() {
    this.watermark = null;
  }
  setWatermark = async (buffer: Buffer) => {
    this.watermark = await Jimp.read(buffer);
  };

  createThumbnail = async (imageBuffer: Buffer): Promise<EditedPhotoDto> => {
    const jimpImg = await Jimp.read(imageBuffer);
    const mime = jimpImg.getMIME();
    const thumbnail = await jimpImg.scaleToFit(200, 200).getBufferAsync(mime);
    return { buffer: thumbnail, mime: mime };
  };
  addWatermark = async (imageBuffer: Buffer): Promise<EditedPhotoDto> => {
    if (!this.watermark) {
      throw ApiError.IsNull("Watermark");
    }
    const jimpImg = await Jimp.read(imageBuffer);
    const mime = jimpImg.getMIME();
    const width = jimpImg.getWidth();
    const height = jimpImg.getHeight();
    const resizedWatermark = await this.watermark.scaleToFit(
      width / 1.2,
      height / 1.2
    );
    const watermarkedPhoto = await jimpImg
      .composite(resizedWatermark, width * 0.12, height * 0.2, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.5,
      })
      .getBufferAsync(mime);
    return { buffer: watermarkedPhoto, mime: mime };
  };
  createWatermarkedThumbnail = async (imageBuffer: Buffer) => {
    const thumbnail = await this.createThumbnail(imageBuffer);
    const watermarkedThumbnail = await this.addWatermark(thumbnail.buffer);
    return watermarkedThumbnail;
  };
}

const photoEditor = new PhotoEditor();
export default photoEditor;
