export interface IConfigEnv {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  LOG_ACTIVE: boolean;
  LOG_LEVEL: string;
  API_BASE_URL: string;
}

export default class ConfigEnv {
  private static config: IConfigEnv;

  static values(): IConfigEnv {
    if (!this.config) {
      this.config = {
        DB_HOST: process.env.DB_HOST,
        DB_PORT: +process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        LOG_ACTIVE: Boolean(process.env.LOG_ACTIVE),
        LOG_LEVEL: process.env.LOG_LEVEL,
        API_BASE_URL: process.env.API_BASE_URL,
      } as IConfigEnv;
    }

    return this.config;
  }
}
