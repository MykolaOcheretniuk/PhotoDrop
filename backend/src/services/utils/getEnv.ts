import { EnvVariables } from "src/enums/envs";

const getEnv = (envName: EnvVariables) => {
  return process.env[envName];
};
export default getEnv;
