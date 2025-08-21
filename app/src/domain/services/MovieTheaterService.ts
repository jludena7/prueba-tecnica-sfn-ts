import ScheduleDto from "../../infrastructure/api/dtos/ScheduleDto";
import SchedulingDto from "../../infrastructure/api/dtos/SchedulingDto";
import { FilmColumnEs } from "../interfaces/FilmColumnEs";
import { MoviePremiereEntity } from "../interfaces/MoviePremiereEntity";
import { MovieTheaterEntity } from "../interfaces/MovieTheaterEntity";
import { MovieTheaterPremiereEntity } from "../interfaces/MovieTheaterPremiereEntity";
import { CreateRequestProps, GetHistoryRequestProps, GetRequestProps } from "../props/request.props";
import { CacheMovieTheaterRepository } from "../repositories/CacheMovieTheaterRepository";
import { RdsMovieTheaterRepository } from "../repositories/RdsMovieTheaterRepository";
import { NUMBER } from "../utils/constants/constants";
import NotFoundError from "../utils/errors/not-found.error";
import { SwService } from "./SwService";

export class MovieTheaterService {
  constructor(
    private readonly rdsMovieTheaterRepository: RdsMovieTheaterRepository,
    private readonly cacheMovieTheaterRepository: CacheMovieTheaterRepository,
    private readonly swService: SwService
  ) {}

  async createMovieTheater(inputData: CreateRequestProps): Promise<object> {

    const movieTheaterId = await this.rdsMovieTheaterRepository.createMovieTheater(inputData);
    if (movieTheaterId) {
      const promiseInsert: Promise<number | undefined>[] = [];

      inputData.programacion.forEach((schedulingDto: SchedulingDto): void => {
        schedulingDto.horarios.forEach((scheduleDto: ScheduleDto): void => {
          promiseInsert.push(
            this.rdsMovieTheaterRepository.createSchedule(
              movieTheaterId,
              schedulingDto.pelicula_codigo,
              scheduleDto,
            ),
          );
        });
      });

      await Promise.all(promiseInsert);
    }

    return { id: movieTheaterId, ...inputData };
  }

  async getMovieTheaterById(inputData: GetRequestProps): Promise<MovieTheaterPremiereEntity> {
    const response: MovieTheaterEntity[] =
      await this.rdsMovieTheaterRepository.getMovieTheater(inputData);

      console.log(response);
    if (response.length < NUMBER.ONE) {
      throw new NotFoundError();
    }

    const filmIds: number[] = response.map(
      (item: MovieTheaterEntity) => item.pelicula_codigo,
    );
    const filmColumnEs: FilmColumnEs[] =
      await this.swService.getFilmsByIds(filmIds);
    const moviePremiereEntity: MoviePremiereEntity[] = filmColumnEs.map(
      (filmColumnEs: FilmColumnEs): MoviePremiereEntity => {
        return {
          fecha_hora_inicio: response[NUMBER.ZERO].fecha_hora_inicio,
          fecha_hora_fin: response[NUMBER.ZERO].fecha_hora_fin,
          pelicula: filmColumnEs,
        };
      },
    );

    const newResponse = {
      sala_cine_id: response[NUMBER.ZERO].sala_cine_id,
      direccion: response[NUMBER.ZERO].direccion,
      numero_sala: response[NUMBER.ZERO].numero_sala,
      tipo_sala: response[NUMBER.ZERO].tipo_sala,
      capacidad: response[NUMBER.ZERO].capacidad,
      pelicula_estreno: moviePremiereEntity,
    } as MovieTheaterPremiereEntity;

    await this.cacheMovieTheaterRepository.createHistory(newResponse);

    return newResponse;
  }

  async getHistoryMovieTheaters(inputData: GetHistoryRequestProps): Promise<MovieTheaterPremiereEntity[]> {
    return this.cacheMovieTheaterRepository.getHistory(inputData);
  }
}
