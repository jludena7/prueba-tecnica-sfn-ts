import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { VALIDATION_MESSAGES } from "../../../domain/utils/messages/errors/validation.message";
import SchedulingDto from "./SchedulingDto";
import { CreateRequestProps, SchedulingProps } from "../../../domain/props/request.props";

export default class CreateMovieTheaterDto {
  @IsString({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_STRING("direccion")),
  })
  @IsNotEmpty({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_NOT_EMPTY("direccion")),
  })
  @MaxLength(100, {
    message: JSON.stringify(VALIDATION_MESSAGES.MAX_LENGTH("direccion", 100)),
  })
  direccion: string;

  @IsNotEmpty({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_NOT_EMPTY("numero_sala")),
  })
  @IsNumberString(
    { no_symbols: true },
    {
      message: JSON.stringify(
        VALIDATION_MESSAGES.IS_NUMBER_STRING("numero_sala"),
      ),
    },
  )
  @ValidateIf((o) => typeof o.numero_sala !== "number")
  numero_sala: number;

  @IsString({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_STRING("tipo_sala")),
  })
  @IsNotEmpty({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_NOT_EMPTY("tipo_sala")),
  })
  @MaxLength(3, {
    message: JSON.stringify(VALIDATION_MESSAGES.MAX_LENGTH("tipo_sala", 3)),
  })
  tipo_sala: string;

  @IsNotEmpty({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_NOT_EMPTY("capacidad")),
  })
  @IsNumberString(
    { no_symbols: true },
    {
      message: JSON.stringify(
        VALIDATION_MESSAGES.IS_NUMBER_STRING("capacidad"),
      ),
    },
  )
  @ValidateIf((o) => typeof o.capacidad !== "number")
  capacidad: number;

  @IsArray({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_ARRAY("programacion")),
  })
  @ArrayNotEmpty({
    message: JSON.stringify(
      VALIDATION_MESSAGES.IS_NOT_ARRAY_EMPTY("programacion"),
    ),
  })
  @ValidateNested({ each: true })
  programacion: SchedulingDto[];

  constructor(request: CreateRequestProps) {
    this.direccion = request.direccion;
    this.numero_sala = request.numero_sala;
    this.tipo_sala = request.tipo_sala;
    this.capacidad = request.capacidad;
    this.programacion = [];

    if (request.programacion) {
      request.programacion.forEach((schedulingProps: SchedulingProps): void => {
        this.programacion.push(new SchedulingDto(schedulingProps));
      });
    }
  }
}
