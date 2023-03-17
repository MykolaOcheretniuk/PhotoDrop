import { ApiError } from "./apiError";

export class PhotographerError extends ApiError {
  constructor(message: string, code: number) {
    super(message, code);
  }
  static WrongPassword() {
    return new PhotographerError(`Incorrect password`, 400);
  }
  static IncorrectRole() {
    return new PhotographerError(`Not available your role `, 403);
  }
}
