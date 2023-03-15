import { JwtPayload } from "jsonwebtoken";
import refreshTokensStorage from "src/db/dynamoDB/refreshTokensStorage";
import personsRepository from "src/db/repositories/personsRepository";
import photographersRepository from "src/db/repositories/photographersRepository";
import rolesRepository from "src/db/repositories/rolesRepository";
import { Roles } from "src/enums/roles";
import { ApiError } from "src/errors/apiError";
import { PhotographerError } from "src/errors/photographersError";
import { TokensError } from "src/errors/tokensError";
import { TokensResponse } from "src/models/tokensResponse";
import jwtTokensService from "./jwtTokensService";
import passwordService from "./passwordService";

class AuthService {
  signIn = async (password: string, login: string): Promise<TokensResponse> => {
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
    const tokens = jwtTokensService.generateTokens(
      personId,
      Roles.PHOTOGRAPHER
    );
    await refreshTokensStorage.addRefreshToken(personId, tokens.refreshToken);
    return tokens;
  };
  refresh = async (refreshToken: string): Promise<TokensResponse> => {
    const tokenPayload = jwtTokensService.validateRefreshToken(
      refreshToken
    ) as JwtPayload;
    const { personId } = tokenPayload;
    const item = await refreshTokensStorage.findRefreshToken(personId);
    if (!item.Item) {
      throw TokensError.LegacyRefreshToken();
    }
    const { RefreshToken: tokenFromDb } = item["Item"];
    if (refreshToken != tokenFromDb) {
      throw TokensError.LegacyRefreshToken();
    }
    const tokens = jwtTokensService.generateTokens(
      personId,
      Roles.PHOTOGRAPHER
    );
    await refreshTokensStorage.addRefreshToken(personId, tokens.refreshToken);
    return tokens;
  };
  checkAuth = async (accessToken: string, role: Roles) => {
    const accessTokenPayload = (await jwtTokensService.validateAccessToken(
      accessToken
    )) as JwtPayload;
    const { personId } = accessTokenPayload;
    const person = await personsRepository.getById(personId);
    if (!person) {
      throw ApiError.NotFound("Person");
    }
    const personRole = await rolesRepository.personRole(personId);
    const { title: roleTitle } = personRole;
    if (roleTitle !== role) {
      throw PhotographerError.IncorrectRole(role as string);
    }
  };
}

const authService = new AuthService();
export default authService;
