import mysql, { Connection, ConnectionOptions, ResultSetHeader } from "mysql2/promise";
import { IRdsDatabase } from "../rds.database";
import { ILogger } from "../../../../../domain/interfaces/ILogger";

export class MysqlDatabase implements IRdsDatabase {
  private connection: Connection | null;
  private logger: ILogger;
  private config: ConnectionOptions;

  constructor(config: ConnectionOptions, logger: ILogger) {
    this.connection = null;
    this.logger = logger;
    this.config = config;
  }

  public async connect(): Promise<void> {
    try {
      if (!this.connection) {
        this.connection = await mysql.createConnection(this.config);
        this.logger.info("Connected to MySQL database");
      }
    } catch (error) {
      this.logger.error("Error connecting to MySQL database", { error });
      throw error;
    }
  }

  public async select<T>(sql: string, params: unknown = []): Promise<T[]> {
    if (!this.connection) {
      throw new Error("Connection not established. Call connect() first.");
    }
    try {
      const [rows] = await this.connection.execute(sql, params);
      return rows as T[];
    } catch (error) {
      this.logger.error("Error executing query", { sql, params, error });
      throw error;
    }
  }

  public async insert(
    sql: string,
    params: unknown = [],
  ): Promise<ResultSetHeader> {
    if (!this.connection) {
      throw new Error("Connection not established. Call connect() first.");
    }
    try {
      const [rows] = await this.connection.execute(sql, params);
      return rows as ResultSetHeader;
    } catch (error) {
      this.logger.error("Error executing query", { sql, params, error });
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (!this.connection) {
      return;
    }

    try {
      await this.connection.end();
      this.logger.info("Connection to MySQL closed");
    } catch (error) {
      this.logger.error("Error closing MySQL connection", { error });
      throw error;
    }
  }
}
