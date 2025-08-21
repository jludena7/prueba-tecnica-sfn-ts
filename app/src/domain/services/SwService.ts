import FilmAdapter from "../adapter/FilmAdapter";
import { FilmColumnEn } from "../interfaces/FilmColumnEn";
import { FilmColumnEs } from "../interfaces/FilmColumnEs";
import { RestMovieTheaterRepository } from "../repositories/RestMovieTheaterRepository";
import CallResponse from "../utils/responses/call.response";

export class SwService {
    constructor(
        private readonly restMovieTheaterRepository: RestMovieTheaterRepository
    ) {}

    async getFilmsByIds(filmIds: number[]): Promise<FilmColumnEs[]> {
        const callApis: Promise<CallResponse<FilmColumnEn>>[] = [];
        filmIds.forEach((filmId: number): void => {
            callApis.push(this.restMovieTheaterRepository.getById(filmId));
        });

        const results = await Promise.all(callApis);
        return results.map(
            (callResponse: CallResponse<FilmColumnEn>): FilmColumnEs => {
            const filmAdapter = new FilmAdapter(callResponse.data);
            return filmAdapter.adapt();
            },
        ) as FilmColumnEs[];
    }
}