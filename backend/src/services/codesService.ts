import twilioSmsSender from "src/services/twilioSmsSender";
import crypto from "crypto";
import confirmationCodesStorage from "src/db/dynamoDB/confirmationCodesStorage";
import { CodesError } from "src/errors/codeErrors";
import { ApiError } from "src/errors/apiError";

class CodesService {
  sendCode = async (phoneNumber: string) => {
    const code = crypto.randomInt(100000, 999999).toString();
    await twilioSmsSender.sendMessage(code, phoneNumber);
    await confirmationCodesStorage.addCode(phoneNumber, code);
  };
  resendCode = async (phoneNumber: string) => {
    const code = crypto.randomInt(100000, 999999).toString();
    const response = await confirmationCodesStorage.findExistingCode(
      phoneNumber
    );
    const { Item: existingCode } = response;
    if (!existingCode) {
      throw ApiError.NotFound("Confirmation Code");
    }
    const { ResendTries: resendTries } = existingCode;
    if (resendTries === 0) {
      throw CodesError.ResendTriesIsOver(phoneNumber);
    }
    await twilioSmsSender.sendMessage(code, phoneNumber);
    await confirmationCodesStorage.resendUpdate(phoneNumber, code);
  };
  validateCode = async (phoneNumber: string, code: string) => {
    const response = await confirmationCodesStorage.findExistingCode(
      phoneNumber
    );
    const { Item: codeFromDb } = response;
    if (!codeFromDb) {
      throw ApiError.NotFound("Confirmation Code");
    }
    const { Code: existingCode, SentTime: sentTime } = codeFromDb;
    if (existingCode !== code) {
      throw CodesError.InvalidCode();
    }
    const currentDate = Math.floor(Date.now() / 1000);
    const dateDif = currentDate - sentTime;
    const threeMinInUnix = 3 * 60;
    if (dateDif > threeMinInUnix) {
      throw CodesError.CodeExpired();
    }
  };
}

const codesService = new CodesService();
export default codesService;
