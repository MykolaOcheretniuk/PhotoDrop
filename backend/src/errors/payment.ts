import { ApiError } from "./apiError";

export class PaymentError extends ApiError {
  constructor(message: string, code: number) {
    super(message, code);
  }
  static NullClientSecret() {
    return new PaymentError(`Null client secret`, 400);
  }
}