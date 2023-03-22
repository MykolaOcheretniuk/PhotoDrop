import * as jwt from "jsonwebtoken";
import { TokensResponse } from "src/models/tokensResponse";
import getEnv from "./getEnv";

class JwtTokensService {
  generateAccessToken = (personId: string, role: string): TokensResponse => {
    const accessToken = jwt.sign(
      { personId: personId, personRole: role },
      getEnv("ACCESS_TOKEN_SECRET") as string,
      { expiresIn: "1d" }
    );
    return { accessToken: accessToken };
  };
  validateAccessToken = async (token: string) => {
    return jwt.verify(token, getEnv("ACCESS_TOKEN_SECRET") as string);
  };
}

const jwtTokensService = new JwtTokensService();
export default jwtTokensService;
