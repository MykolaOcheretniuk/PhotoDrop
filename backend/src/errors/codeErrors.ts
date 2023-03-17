import { ApiError } from "./apiError";

export class CodesError extends ApiError {
  constructor(message: string, code: number) {
    super(message, code);
  }
  static ResendTriesIsOver(number: string) {
    return new CodesError(`Resend tries is over for number:${number}`, 400);
  }
  static InvalidCode() {
    return new CodesError(`Code you sent is invalid`, 400);
  }
  static CodeExpired() {
    return new CodesError(`Code you sent is expired`, 400);
  }
}
