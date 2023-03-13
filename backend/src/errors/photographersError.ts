import { ApiError } from "./apiError";

export class PhotographerError extends ApiError {
  constructor(message: string, code: number) {
    super(message, code);
  }
  static WrongPassword() {
    return new PhotographerError(`Incorrect password`, 400);
  }
  static IncorrectRole(role: string) {
    return new PhotographerError(`Not available for ${role}`, 403);
  }
}
