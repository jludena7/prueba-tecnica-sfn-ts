import { FilmColumnEn } from "../../../domain/interfaces/FilmColumnEn";
import axios, { AxiosError } from "axios";
import { ILogger } from "../../../domain/interfaces/ILogger";
import { RestMovieTheaterRepository } from "../../../domain/repositories/RestMovieTheaterRepository";
import CallError from "../../../domain/utils/errors/call.error";
import CallResponse from "../../../domain/utils/responses/call.response";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../domain/utils/constants/constants";
import ConfigEnv from "../../../domain/utils/env/config.env";

export class HttpMovieTheaterRepository implements RestMovieTheaterRepository{
    private readonly url: string;

    constructor(private logger: ILogger) {
        this.url = `${ConfigEnv.values().API_BASE_URL}/api/films`;
    }

    async getById(id: number): Promise<CallResponse<FilmColumnEn>> {
      this.logger.info(`FilmsProviderImpl | getById | id`, id);
      try {
        const url = `${this.url}/${id}`;
        this.logger.debug(`FilmsProviderImpl | getById | url:`, url);
        const response = await axios.get(url);
        return new CallResponse<FilmColumnEn>(response.status, response.data);
      } catch (error) {
        this.logger.error(`FilmsProviderImpl | getById | error:`, error);
        if (error instanceof AxiosError) {
          throw new CallError(error.response.status, error.response.statusText);
        }

        throw new CallError(HTTP_STATUS.CODE_500, ERROR_MESSAGE.API_CALL_ERROR);
      }
    }
}
