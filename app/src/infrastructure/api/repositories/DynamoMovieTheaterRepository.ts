import { MovieTheaterPremiereEntity } from "../../../domain/interfaces/MovieTheaterPremiereEntity";
import { GetHistoryRequestProps } from "../../../domain/props/request.props";
import { CacheMovieTheaterRepository } from "../../../domain/repositories/CacheMovieTheaterRepository";
import { ICacheDatabase } from "../utils/database/cache.database";

export class DynamoMovieTheaterRepository implements CacheMovieTheaterRepository {
    constructor(private cacheDatabase: ICacheDatabase) {}

    async createHistory(inputData: object): Promise<boolean> {
        return this.cacheDatabase.insertItem('sala_cine_historial', inputData);
    }

    async getHistory(inputData: GetHistoryRequestProps): Promise<MovieTheaterPremiereEntity[]> {
        const {limit, lastEvaluatedKey} = inputData;
        return this.cacheDatabase.queryWithPagination('sala_cine_historial', {limit, lastEvaluatedKey}) as unknown as MovieTheaterPremiereEntity[];
    }
}