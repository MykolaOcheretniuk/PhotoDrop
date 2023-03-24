import { AnyMySqlTable, InferModel } from "drizzle-orm/mysql-core/table";
import { MySql2Database } from "drizzle-orm/mysql2";
import { database } from "../dbConnection";

export abstract class BaseRepository<T extends InferModel<AnyMySqlTable>> {
  protected table: AnyMySqlTable;
  protected db: MySql2Database;
  constructor(table: AnyMySqlTable) {
    this.table = table;
    this.db = database;
  }
  addNew = async (entity: T) => {
    return await this.db.insert(this.table).values(entity);
  };
}
