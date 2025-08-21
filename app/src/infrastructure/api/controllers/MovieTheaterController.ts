import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_STATUS } from "../../../domain/utils/constants/constants";
import PayloadError from "../../../domain/utils/errors/payload.error";
import UnknownError from "../../../domain/utils/errors/unknown.error";
import CreateMovieTheaterDto from "../dtos/CreateMovieTheaterDto";
import { CreateRequestProps, GetHistoryRequestProps, GetRequestProps } from "../../../domain/props/request.props";
import ValidatorPayload from "../utils/validators/validator.payload";
import { ILogger } from "../../../domain/interfaces/ILogger";
import NotFoundError from "../../../domain/utils/errors/not-found.error";
import CallError from "../../../domain/utils/errors/call.error";
import GetMovieTheaterDto from "../dtos/GetMovieTheaterDto";
import { CreateMovieTheaterUseCase } from "../../../application/useCases/CreateMovieTheaterUseCase";
import { GetMovieTheaterUseCase } from "../../../application/useCases/GetMovieTheaterUseCase";
import { GetHistoryMovieTheaterUseCase } from "../../../application/useCases/GetHistoryMovieTheaterUseCase";
import GetHistoryMovieTheaterDto from "../dtos/GetHistoryMovieTheaterDto";

export class MovieTheaterController {
  constructor(
    private readonly logger: ILogger,
    private readonly createMovieTheaterUseCase: CreateMovieTheaterUseCase,
    private readonly getMovieTheaterUseCase: GetMovieTheaterUseCase,
    private readonly getHistoryMovieTheaterUseCase: GetHistoryMovieTheaterUseCase
  ) {}

  async createMovieTheater(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    this.logger.info(`MovieTheaterController | create`);
    try {
      const request = (event.body ? JSON.parse(event.body) : {}) as unknown as CreateRequestProps;
      const inputData = new CreateMovieTheaterDto(request);

      await ValidatorPayload.run(inputData);

      const response = await this.createMovieTheaterUseCase.execute(inputData);

      return {
        statusCode: HTTP_STATUS.CODE_201,
        body: JSON.stringify(response),
      };
    } catch (error) {
      if (error instanceof PayloadError) {
        return {
          statusCode: HTTP_STATUS.CODE_404,
          body: JSON.stringify(error.errorBody),
        };
      }

      this.logger.error(`MovieTheaterController | create | error:`, error);
      return {
        statusCode: HTTP_STATUS.CODE_500,
        body: JSON.stringify(new UnknownError().errorBody),
      };
    }
  }

  async getMovieTheater(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    this.logger.info(`MovieTheaterController | get`);
    try {
      const inputData = new GetMovieTheaterDto(
        event.pathParameters as unknown as GetRequestProps,
      );

      await ValidatorPayload.run(inputData);

      const response = await this.getMovieTheaterUseCase.execute(inputData);

      return {
        statusCode: HTTP_STATUS.CODE_200,
        body: JSON.stringify(response),
      };
    } catch (error) {
      if (
        error instanceof PayloadError ||
        error instanceof NotFoundError ||
        error instanceof CallError
      ) {
        return {
          statusCode: error.httpCode,
          body: JSON.stringify(error.errorBody),
        };
      }

      this.logger.error(`MovieTheaterController | get | error:`, error);
      return {
        statusCode: HTTP_STATUS.CODE_500,
        body: JSON.stringify(new UnknownError().errorBody),
      };
    }
  }

  async getHistoryMovieTheaters(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    this.logger.info(`MovieTheaterController | getHistoryMovieTheaters`);
    try {
      const inputData = new GetHistoryMovieTheaterDto(
        event.queryStringParameters as unknown as GetHistoryRequestProps,
      );

      await ValidatorPayload.run(inputData);

      const response = await this.getHistoryMovieTheaterUseCase.execute(inputData);

      return {
        statusCode: HTTP_STATUS.CODE_200,
        body: JSON.stringify(response),
      };
    } catch (error) {
      if (
        error instanceof PayloadError ||
        error instanceof NotFoundError ||
        error instanceof CallError
      ) {
        return {
          statusCode: error.httpCode,
          body: JSON.stringify(error.errorBody),
        };
      }

      this.logger.error(`MovieTheaterController | getHistoryMovieTheaters | error:`, error);
      return {
        statusCode: HTTP_STATUS.CODE_500,
        body: JSON.stringify(new UnknownError().errorBody),
      };
    }
  }
}
