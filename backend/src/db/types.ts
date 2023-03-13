import { InferModel } from "drizzle-orm/mysql-core/table";
import { photos } from "./schema/photo";

export type Photo = InferModel<typeof photos>;
