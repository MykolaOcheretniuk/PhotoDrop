import { EnvVariables } from "src/enums/getEnv";

const getEnv = (envName: EnvVariables) => {
  return process.env[envName];
};
export default getEnv;
