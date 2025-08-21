import { IsNotEmpty, IsNumberString, ValidateIf } from "class-validator";
import { GetRequestProps } from "../../../domain/props/request.props";
import { VALIDATION_MESSAGES } from "../../../domain/utils/messages/errors/validation.message";

export default class GetMovieTheaterDto {
  @IsNotEmpty({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_NOT_EMPTY("id")),
  })
  @IsNumberString(
    { no_symbols: true },
    {
      message: JSON.stringify(VALIDATION_MESSAGES.IS_NUMBER_STRING("id")),
    },
  )
  @ValidateIf((o) => typeof o.id !== "number")
  id: number;

  constructor(request: GetRequestProps) {
    this.id = request.id;
  }
}
