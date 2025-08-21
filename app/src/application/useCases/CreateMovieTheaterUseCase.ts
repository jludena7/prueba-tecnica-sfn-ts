import { CreateRequestProps } from "../../domain/props/request.props";
import { MovieTheaterService } from "../../domain/services/MovieTheaterService";

export class CreateMovieTheaterUseCase {
    constructor(private movieTheaterService: MovieTheaterService) {}
        
    async execute(payload: CreateRequestProps): Promise<object> {
        return this.movieTheaterService.createMovieTheater(payload);
    }
}