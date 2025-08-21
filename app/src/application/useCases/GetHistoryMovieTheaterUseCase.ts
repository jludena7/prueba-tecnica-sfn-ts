import { MovieTheaterPremiereEntity } from "../../domain/interfaces/MovieTheaterPremiereEntity";
import { GetHistoryRequestProps } from "../../domain/props/request.props";
import { MovieTheaterService } from "../../domain/services/MovieTheaterService";

export class GetHistoryMovieTheaterUseCase {
    constructor(private movieTheaterService: MovieTheaterService) {}
    
    async execute(inputData: GetHistoryRequestProps): Promise<MovieTheaterPremiereEntity[]> {
        return this.movieTheaterService.getHistoryMovieTheaters(inputData);
    }
}