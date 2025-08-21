import { ResultSetHeader } from "mysql2/promise";

export interface IRdsDatabase {
  connect(): Promise<void>;

  select<T>(sql: string, params: unknown[]): Promise<T[]>;

  insert(sql: string, params: unknown[]): Promise<ResultSetHeader>;

  close(): Promise<void>;
}
