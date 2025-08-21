export interface ScheduleProps {
  inicio: string;

  fin: string;
}

export interface SchedulingProps {
  pelicula_codigo: number;

  horarios: ScheduleProps[];
}

export interface CreateRequestProps {
  direccion: string;

  numero_sala: number;

  tipo_sala: string;

  capacidad: number;

  programacion: SchedulingProps[];
}

export interface CreateScheduleRequestProps {
  inicio: string;
  fin: string;
}

export interface GetRequestProps {
  id: number;
}

export interface GetHistoryRequestProps {
  limit: number;
  lastEvaluatedKey?: object;
}