import * as bcrypt from "bcryptjs";
class PasswordService {
  hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  validatePassword = async (
    password: string,
    passwordHash: string
  ): Promise<boolean> => {
    return await bcrypt.compare(password, passwordHash);
  };
}
const passwordService = new PasswordService();
export default passwordService;
