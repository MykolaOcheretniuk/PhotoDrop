import SHA256 from "crypto-js/sha256";
class PasswordService {
  validatePassword = (password: string, passwordHash: string): boolean => {
    if (SHA256(password).toString() === passwordHash) {
      return true;
    }
    return false;
  };
}
const passwordService = new PasswordService();
export default passwordService;
