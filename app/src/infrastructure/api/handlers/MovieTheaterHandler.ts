import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ILogger } from "../../../domain/interfaces/ILogger";
import { MovieTheaterController } from "../controllers/MovieTheaterController";
import { WinstonLogger } from "../logger/WinstonLogger";
import { IRdsDatabase } from "../utils/database/rds.database";
import { MysqlDatabase } from "../utils/database/implement/mysql.database";
import ConfigEnv from "../../../domain/utils/env/config.env";
import { MysqlMovieTheaterRepository } from "../repositories/MysqlMovieTheaterRepository";
import { MovieTheaterService } from "../../../domain/services/MovieTheaterService";
import { GetHistoryMovieTheaterUseCase } from "../../../application/useCases/GetHistoryMovieTheaterUseCase";
import { SwService } from "../../../domain/services/SwService";
import { DynamoMovieTheaterRepository } from "../repositories/DynamoMovieTheaterRepository";
import { HttpMovieTheaterRepository } from "../repositories/HttpMovieTheaterRepository";
import { GetMovieTheaterUseCase } from "../../../application/useCases/GetMovieTheaterUseCase";
import { CreateMovieTheaterUseCase } from "../../../application/useCases/CreateMovieTheaterUseCase";
import { DynamoDatabase } from "../utils/database/implement/dynamo.database";

interface Dependencies {
  createUseCase: CreateMovieTheaterUseCase;
  getUseCase: GetMovieTheaterUseCase;
  getHistoryUseCase: GetHistoryMovieTheaterUseCase;
  controller: MovieTheaterController;
}

let dependencies: Dependencies | null = null;

const initializeDependencies = async (): Promise<Dependencies> => {
  if (!dependencies) {
    const logger: ILogger = new WinstonLogger();
    logger.info('#Start api');
    
    // Database connection
    const database: IRdsDatabase = new MysqlDatabase({
      user: ConfigEnv.values().DB_USER,
      password: ConfigEnv.values().DB_PASSWORD,
      database: ConfigEnv.values().DB_NAME,
      host: ConfigEnv.values().DB_HOST,
      port: ConfigEnv.values().DB_PORT,
    }, logger);

    const cacheDatabase = new DynamoDatabase();

    // Repositories
    const mysqlMovieTheaterRepository = new MysqlMovieTheaterRepository(database, logger);
    const dynamoMovieTheaterRepository = new DynamoMovieTheaterRepository(cacheDatabase);
    const httpMovieTheaterRepository = new HttpMovieTheaterRepository(logger);

    // Services
    const swService = new SwService(httpMovieTheaterRepository);
    const movieTheaterService = new MovieTheaterService(
      mysqlMovieTheaterRepository,
      dynamoMovieTheaterRepository,
      swService
    );

    // Use Cases
    const createMovieTheaterUseCase = new CreateMovieTheaterUseCase(movieTheaterService);
    const getMovieTheaterUseCase = new GetMovieTheaterUseCase(movieTheaterService);
    const getHistoryMovieTheaterUseCase = new GetHistoryMovieTheaterUseCase(movieTheaterService);

    // Controller
    const movieTheaterController = new MovieTheaterController(
      logger,
      createMovieTheaterUseCase,
      getMovieTheaterUseCase,
      getHistoryMovieTheaterUseCase
    );

    dependencies = {
      createUseCase: createMovieTheaterUseCase,
      getUseCase: getMovieTheaterUseCase,
      getHistoryUseCase: getHistoryMovieTheaterUseCase,
      controller: movieTheaterController
    };
  }
  
  return dependencies;
};

const routeRequest = async (event: APIGatewayProxyEvent, controller: MovieTheaterController): Promise<APIGatewayProxyResult> => {
  const { httpMethod, path } = event;
  
  console.log('Routing request:', { httpMethod, path });

  // Routing basado en el path completo
  switch (true) {
    case httpMethod === 'POST' && path.endsWith('/sala-cine'):
      return controller.createMovieTheater(event);
    
    case httpMethod === 'GET' && path.includes('/sala-cine/') && !path.endsWith('/historial'):
      // Es una ruta GET /sala-cine/{id}
      return controller.getMovieTheater(event);
    
    case httpMethod === 'GET' && path.endsWith('/sala-cine/historial'):
      return controller.getHistoryMovieTheaters(event);
    
    default:
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ 
          error: "Route not found",
          details: { 
            httpMethod, 
            path,
            availableRoutes: [
              'POST /sala-cine',
              'GET /sala-cine/{id}',
              'GET /sala-cine/historial'
            ]
          }
        })
      };
  }
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { controller } = await initializeDependencies();
    return await routeRequest(event, controller);
  } catch (error) {
    console.error("Error in movieTheater handler:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      })
    };
  }
};