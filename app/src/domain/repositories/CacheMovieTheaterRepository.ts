import { MovieTheaterPremiereEntity } from "../interfaces/MovieTheaterPremiereEntity";
import { GetHistoryRequestProps } from "../props/request.props";

export interface CacheMovieTheaterRepository {
    createHistory(inputData: object): Promise<boolean>;

    getHistory(inputData: GetHistoryRequestProps): Promise<MovieTheaterPremiereEntity[]>;
}