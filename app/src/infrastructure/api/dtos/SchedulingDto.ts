import { ScheduleProps, SchedulingProps } from "../../../domain/props/request.props";
import { VALIDATION_MESSAGES } from "../../../domain/utils/messages/errors/validation.message";
import ScheduleDto from "./ScheduleDto";
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  ValidateIf,
  ValidateNested,
} from "class-validator";


export default class SchedulingDto {
  @IsNotEmpty({
    message: JSON.stringify(
      VALIDATION_MESSAGES.IS_NOT_EMPTY("pelicula_codigo"),
    ),
  })
  @IsNumberString(
    { no_symbols: true },
    {
      message: JSON.stringify(
        VALIDATION_MESSAGES.IS_NUMBER_STRING("pelicula_codigo"),
      ),
    },
  )
  @ValidateIf((o) => typeof o.pelicula_codigo !== "number")
  pelicula_codigo: number;

  @IsArray({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_ARRAY("horarios")),
  })
  @ArrayNotEmpty({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_NOT_ARRAY_EMPTY("horarios")),
  })
  @ValidateNested({ each: true })
  horarios: ScheduleDto[];

  constructor(request: SchedulingProps) {
    this.pelicula_codigo = request.pelicula_codigo;
    this.horarios = [];

    if (request.horarios) {
      request.horarios.forEach((scheduleProps: ScheduleProps): void => {
        this.horarios.push(new ScheduleDto(scheduleProps));
      });
    }
  }
}
