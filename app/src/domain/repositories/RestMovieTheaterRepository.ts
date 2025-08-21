import { FilmColumnEn } from "../interfaces/FilmColumnEn";
import CallResponse from "../utils/responses/call.response";

export interface RestMovieTheaterRepository {
    getById(id: number): Promise<CallResponse<FilmColumnEn>>;
}