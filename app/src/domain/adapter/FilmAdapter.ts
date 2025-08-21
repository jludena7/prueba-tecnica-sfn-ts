import { FilmColumnEn } from "../interfaces/FilmColumnEn";
import { FilmColumnEs } from "../interfaces/FilmColumnEs";

export default class FilmAdapter {
    constructor(private filmColumnEs: FilmColumnEn) {}
  
    public adapt(): FilmColumnEs {
      return {
        titulo: this.filmColumnEs.title,
        episodio_id: this.filmColumnEs.episode_id,
        resumen: this.filmColumnEs.opening_crawl,
        director: this.filmColumnEs.director,
        productor: this.filmColumnEs.producer,
        fecha_lanzamiento: this.filmColumnEs.release_date,
      };
    }
  }