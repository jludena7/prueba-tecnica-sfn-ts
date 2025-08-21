import { MovieTheaterPremiereEntity } from "../../domain/interfaces/MovieTheaterPremiereEntity";
import { GetRequestProps } from "../../domain/props/request.props";
import { MovieTheaterService } from "../../domain/services/MovieTheaterService";

export class GetMovieTheaterUseCase {
    constructor(private movieTheaterService: MovieTheaterService) {}

    async execute(inputData: GetRequestProps): Promise<MovieTheaterPremiereEntity> {
        return this.movieTheaterService.getMovieTheaterById(inputData);
    }
}