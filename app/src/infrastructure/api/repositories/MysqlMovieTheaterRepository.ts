import { ILogger } from "../../../domain/interfaces/ILogger";
import { MovieTheaterEntity } from "../../../domain/interfaces/MovieTheaterEntity";
import { CreateRequestProps, CreateScheduleRequestProps, GetRequestProps } from "../../../domain/props/request.props";
import { RdsMovieTheaterRepository } from "../../../domain/repositories/RdsMovieTheaterRepository"
import { NUMBER } from "../../../domain/utils/constants/constants";
import { IRdsDatabase } from "../utils/database/rds.database"
import movieTheaterQuery from "./query/movie-theater.query";
import { ResultSetHeader } from "mysql2/promise";

export class MysqlMovieTheaterRepository implements RdsMovieTheaterRepository{
    constructor(private database: IRdsDatabase, private logger: ILogger) {}

    async createMovieTheater(inputData: CreateRequestProps): Promise<number | undefined> {
        this.logger.info(`MovieTheaterRepository | create`);
        await this.database.connect();
        try {
        const query: string = movieTheaterQuery.createMovieTheater;
        const params: unknown[] = [
            inputData.direccion,
            inputData.numero_sala,
            inputData.tipo_sala,
            inputData.capacidad,
            new Date(),
        ];
        const response: ResultSetHeader = await this.database.insert(
            query,
            params,
        );
        if (response.insertId) {
            return response.insertId;
        }
        } catch (error) {
            this.logger.error(`MovieTheaterRepository | create`, error);
        }

        return undefined;
    }

    async createSchedule(
        movieTheaterId: number,
        peliculaCodigo: number,
        scheduleDto: CreateScheduleRequestProps,
    ): Promise<number | undefined> {
        this.logger.info(`MovieTheaterRepository | createSchedule`);
        await this.database.connect();
        try {
        const query: string = movieTheaterQuery.createSchedule;
        const params: unknown[] = [
            movieTheaterId,
            peliculaCodigo,
            scheduleDto.inicio,
            scheduleDto.fin,
            new Date(),
        ];

        const response: ResultSetHeader = await this.database.insert(
            query,
            params,
        );
        if (response.insertId) {
            return response.insertId;
        }
        } catch (error) {
            this.logger.error(`MovieTheaterRepository | createSchedule`, error);
        }

        return undefined;
    }

    async getMovieTheater(inputData: GetRequestProps): Promise<MovieTheaterEntity[]> {
        this.logger.info(`MovieTheaterRepository | get`);
        await this.database.connect();
        try {
        const query: string = movieTheaterQuery.get;
        const params: unknown[] = [inputData.id];
        const response = await this.database.select<MovieTheaterEntity>(
            query,
            params,
        );
        if (response.length > NUMBER.ZERO) {
            return response as MovieTheaterEntity[];
        }
        } catch (error) {
            this.logger.error(`MovieTheaterRepository | get`, error);
        }

        return [];
    }
}