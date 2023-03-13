import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";

const poolConnection = mysql.createPool({
  connectionLimit: 100,
  host: process.env.PHOTO_DROP_DB_ENDPOINT,
  user: process.env.PHOTO_DROP_DB_USERNAME,
  database: process.env.PHOTO_DROP_DB_NAME,
  password: process.env.PHOTO_DROP_DB_PASSWORD,
  port: parseInt(process.env.PHOTO_DROP_DB_PORT as string),
});

export const database = drizzle(poolConnection);
