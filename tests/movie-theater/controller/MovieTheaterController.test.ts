import {CacheMovieTheaterRepository} from "../../../app/src/domain/repositories/CacheMovieTheaterRepository";
import {RdsMovieTheaterRepository} from "../../../app/src/domain/repositories/RdsMovieTheaterRepository";
import {RestMovieTheaterRepository} from "../../../app/src/domain/repositories/RestMovieTheaterRepository";
import {MovieTheaterController} from "../../../app/src/infrastructure/api/controllers/MovieTheaterController";
import {MovieTheaterService} from "../../../app/src/domain/services/MovieTheaterService";
import {SwService} from "../../../app/src/domain/services/SwService";
import {ILogger} from "../../../app/src/domain/interfaces/ILogger";
import {CreateMovieTheaterUseCase} from "../../../app/src/application/useCases/CreateMovieTheaterUseCase";
import {GetMovieTheaterUseCase} from "../../../app/src/application/useCases/GetMovieTheaterUseCase";
import {GetHistoryMovieTheaterUseCase} from "../../../app/src/application/useCases/GetHistoryMovieTheaterUseCase";
import {APIGatewayProxyEvent} from "aws-lambda";
import {HTTP_STATUS} from "../../../app/src/domain/utils/constants/constants";
import {CreateMovieTheaterData} from "../../utils/response-repositories/ResponseRds";
import {REQUEST_API} from "../../utils/request/Request";
import {RESPONSE_API} from "../../utils/response/Response";
import PayloadError from "../../../app/src/domain/utils/errors/payload.error";
import {VALIDATION_MESSAGES} from "../../../app/src/domain/utils/messages/errors/validation.message";
import UnknownError from "../../../app/src/domain/utils/errors/unknown.error";
import {WinstonLogger} from "../../../app/src/infrastructure/api/logger/WinstonLogger";

describe("MovieTheaterController", () => {
  let cacheMovieTheaterRepositoryMock: jest.Mocked<CacheMovieTheaterRepository>;
  let rdsMovieTheaterRepositoryMock: jest.Mocked<RdsMovieTheaterRepository>;
  let restMovieTheaterRepositoryMock: jest.Mocked<RestMovieTheaterRepository>;
  let loggerMock: ILogger;
  let movieTheaterControllerMock: MovieTheaterController;
  let createMovieTheaterUseCase: CreateMovieTheaterUseCase;
  let getMovieTheaterUseCase: GetMovieTheaterUseCase;
  let getHistoryMovieTheaterUseCase: GetHistoryMovieTheaterUseCase;

  beforeEach((): void => {
    cacheMovieTheaterRepositoryMock = {
      createHistory: jest.fn(),
      getHistory: jest.fn(),
    } as jest.Mocked<CacheMovieTheaterRepository>;

    rdsMovieTheaterRepositoryMock = {
      createMovieTheater: jest.fn(),
      createSchedule: jest.fn(),
      getMovieTheater: jest.fn(),
    } as jest.Mocked<RdsMovieTheaterRepository>;

    const swService = new SwService(restMovieTheaterRepositoryMock);
    const movieTheaterService = new MovieTheaterService(
        rdsMovieTheaterRepositoryMock,
        cacheMovieTheaterRepositoryMock,
        swService
    );
    loggerMock = new WinstonLogger();
    createMovieTheaterUseCase = new CreateMovieTheaterUseCase(movieTheaterService);
    getMovieTheaterUseCase = new GetMovieTheaterUseCase(movieTheaterService);
    getHistoryMovieTheaterUseCase = new GetHistoryMovieTheaterUseCase(movieTheaterService);

    movieTheaterControllerMock = new MovieTheaterController(
        loggerMock,
        createMovieTheaterUseCase,
        getMovieTheaterUseCase,
        getHistoryMovieTheaterUseCase
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and create a new movie theater", async () => {
    rdsMovieTheaterRepositoryMock.createMovieTheater = jest.fn().mockResolvedValue(CreateMovieTheaterData.OK_RESPONSE);
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify(REQUEST_API.createMovieTheater200),
      headers: {},
      httpMethod: "POST",
      isBase64Encoded: false,
      path: "/sala-cine",
      pathParameters: null,
      queryStringParameters: null,
      stageVariables: null,
      requestContext: null,
      resource: "",
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
    };

    const result = await movieTheaterControllerMock.createMovieTheater(event);

    expect(result.statusCode).toBe(HTTP_STATUS.CODE_201);
    expect(result.body).toBe(JSON.stringify(RESPONSE_API.createMovieTheater));
  });

  it("should return 404 if PayloadError is thrown", async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify(REQUEST_API.createMovieTheater404),
      headers: {},
      httpMethod: "POST",
      isBase64Encoded: false,
      path: "/sala-cine",
      pathParameters: null,
      queryStringParameters: null,
      stageVariables: null,
      requestContext: null,
      resource: "",
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
    };

    const result = await movieTheaterControllerMock.createMovieTheater(event);

    expect(result.statusCode).toBe(HTTP_STATUS.CODE_404);
    expect(result.body).toBe(
      JSON.stringify(
        new PayloadError(VALIDATION_MESSAGES.IS_NOT_EMPTY("direccion"))
          .errorBody,
      ),
    );
  });

  it("should return 500 if an unknown error is thrown", async () => {
    rdsMovieTheaterRepositoryMock.createMovieTheater = jest
      .fn()
      .mockRejectedValue(new UnknownError());

    movieTheaterControllerMock = new MovieTheaterController(
        loggerMock,
        createMovieTheaterUseCase,
        getMovieTheaterUseCase,
        getHistoryMovieTheaterUseCase
    );

    const event: APIGatewayProxyEvent = {
      body: JSON.stringify(REQUEST_API.createMovieTheater200),
      headers: {},
      httpMethod: "POST",
      isBase64Encoded: false,
      path: "/sala-cine",
      pathParameters: null,
      queryStringParameters: null,
      stageVariables: null,
      requestContext: null,
      resource: "",
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
    };

    const result = await movieTheaterControllerMock.createMovieTheater(event);

    expect(result.statusCode).toBe(HTTP_STATUS.CODE_500);
    expect(result.body).toBe(JSON.stringify(new UnknownError().errorBody));
  });

  it("should return 404 if an unknown error is thrown", async () => {
    const event: APIGatewayProxyEvent = {
      body: null,
      headers: {},
      httpMethod: "POST",
      isBase64Encoded: false,
      path: "/sala-cine",
      pathParameters: null,
      queryStringParameters: null,
      stageVariables: null,
      requestContext: null,
      resource: "",
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
    };

    const result = await movieTheaterControllerMock.createMovieTheater(event);

    expect(result.statusCode).toBe(HTTP_STATUS.CODE_404);
    expect(result.body).toBe(
      JSON.stringify(VALIDATION_MESSAGES.MAX_LENGTH("direccion", 100)),
    );
  });
});
