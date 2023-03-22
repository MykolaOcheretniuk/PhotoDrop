import { JwtPayload } from "jsonwebtoken";
import confirmationCodesStorage from "src/db/dynamoDB/confirmationCodesStorage";
import personsRepository from "src/db/repositories/personsRepository";
import photographersRepository from "src/db/repositories/photographersRepository";
import rolesRepository from "src/db/repositories/rolesRepository";
import usersRepository from "src/db/repositories/usersRepository";
import { Roles } from "src/enums/roles";
import { ApiError } from "src/errors/apiError";
import { PhotographerError } from "src/errors/photographersError";
import { TokensResponse } from "src/models/tokensResponse";
import { LoginAndRegistrationModel } from "src/models/users/loginAndRegistration";
import codesService from "./codesService";
import jwtTokensService from "./jwtTokensService";
import passwordService from "./passwordService";
import usersService from "./usersService";

class AuthService {
  signInPhotographer = async (
    password: string,
    login: string
  ): Promise<TokensResponse> => {
    const photographer = await photographersRepository.getByLogin(login);
    if (!photographer) {
      throw ApiError.NotFound("Photographer");
    }
    const { passwordHash, personId } = photographer;
    const isPasswordCorrect = await passwordService.validatePassword(
      password,
      passwordHash
    );
    if (!isPasswordCorrect) {
      throw PhotographerError.WrongPassword();
    }
    const tokens = jwtTokensService.generateAccessToken(
      personId,
      Roles.PHOTOGRAPHER
    );
    return tokens;
  };
  checkAuth = async (accessToken: string, role: Roles) => {
    const { personId } = (await jwtTokensService.validateAccessToken(
      accessToken
    )) as JwtPayload;
    const person = await personsRepository.getById(personId);
    if (!person) {
      throw ApiError.NotFound("Person");
    }
    const { title: roleTitle } = await rolesRepository.personRole(personId);
    if (roleTitle !== role) {
      throw PhotographerError.IncorrectRole();
    }
  };
  loginRegisterUser = async (model: LoginAndRegistrationModel) => {
    const { phoneNumber, confirmationCode } = model;
    await codesService.validateCode(phoneNumber, confirmationCode);
    const user = await usersRepository.getByPhoneNumber(phoneNumber);
    if (!user) {
      const { personId } = await usersService.createNew(phoneNumber);
      const jwtToken = jwtTokensService.generateAccessToken(
        personId,
        Roles.USER
      );
      await confirmationCodesStorage.deleteCode(phoneNumber);
      return jwtToken;
    }
    const { personId } = user;
    if (!personId) {
      throw ApiError.IsNull("Person id");
    }
    const jwtToken = jwtTokensService.generateAccessToken(personId, Roles.USER);
    await confirmationCodesStorage.deleteCode(phoneNumber);
    return jwtToken;
  };
}

const authService = new AuthService();
export default authService;
