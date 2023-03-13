import { ApiError } from "./apiError";

export class AlbumError extends ApiError {
  constructor(message: string, code: number) {
    super(message, code);
  }
  static IncorrectValue(field: string) {
    return new AlbumError(`Incorrect field:${field}`, 500);
  }
}
