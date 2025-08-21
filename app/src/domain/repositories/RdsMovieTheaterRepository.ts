import { MovieTheaterEntity } from "../interfaces/MovieTheaterEntity";
import { CreateRequestProps, CreateScheduleRequestProps, GetRequestProps } from "../props/request.props";

export interface RdsMovieTheaterRepository {
    createMovieTheater(inputData: CreateRequestProps): Promise<number | undefined>;
    createSchedule(
        movieTheaterId: number,
        peliculaCodigo: number,
        scheduleDto: CreateScheduleRequestProps
    ): Promise<number | undefined>;
    getMovieTheater(inputData: GetRequestProps): Promise<MovieTheaterEntity[]>;
}