import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";
import getEnv from "src/services/utils/getEnv";

const poolConnection = mysql.createPool({
  connectionLimit: 100,
  host: getEnv("PHOTO_DROP_DB_ENDPOINT"),
  user: getEnv("PHOTO_DROP_DB_USERNAME"),
  database: getEnv("PHOTO_DROP_DB_NAME"),
  password: getEnv("PHOTO_DROP_DB_PASSWORD"),
  port: parseInt(getEnv("PHOTO_DROP_DB_PORT") as string),
});

export const database = drizzle(poolConnection);
