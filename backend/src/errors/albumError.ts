import { ApiError } from "./apiError";

export class AlbumError extends ApiError {
  constructor(message: string, code: number) {
    super(message, code);
  }
  static IncorrectValue(field: string) {
    return new AlbumError(`Incorrect field:${field}`, 400);
  }
  static NotBelongs(personId: string) {
    return new AlbumError(`Album not belongs to person: ${personId} `, 403);
  }
}
