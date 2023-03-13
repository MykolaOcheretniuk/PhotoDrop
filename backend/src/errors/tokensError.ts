import { ApiError } from "./apiError";

export class TokensError extends ApiError {
  constructor(message: string, code: number) {
    super(message, code);
  }
  static LegacyRefreshToken() {
    return new TokensError("Legacy refresh token", 400);
  }
}
