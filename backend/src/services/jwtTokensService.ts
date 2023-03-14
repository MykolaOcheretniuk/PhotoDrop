import * as jwt from "jsonwebtoken";
import { TokensResponse } from "src/models/tokensResponse";

class JwtTokensService {
  generateTokens = (personId: string,role:string): TokensResponse => {
    const accessToken = jwt.sign(
      { personId: personId ,personRole:role},
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { personId: personId },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "30d" }
    );
    return { accessToken: accessToken, refreshToken: refreshToken };
  };
  validateRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
  };
  validateAccessToken = async (token: string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
  };
}

const jwtTokensService = new JwtTokensService();
export default jwtTokensService;
