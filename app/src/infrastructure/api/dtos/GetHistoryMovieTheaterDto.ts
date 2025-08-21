import { IsNotEmpty, IsNumberString, ValidateIf } from "class-validator";
import { GetHistoryRequestProps } from "../../../domain/props/request.props";
import { VALIDATION_MESSAGES } from "../../../domain/utils/messages/errors/validation.message";

export default class GetHistoryMovieTheaterDto {
  lastEvaluatedKey?: object;

  @IsNotEmpty({
    message: JSON.stringify(VALIDATION_MESSAGES.IS_NOT_EMPTY("limit")),
  })
  @IsNumberString(
    { no_symbols: true },
    {
      message: JSON.stringify(VALIDATION_MESSAGES.IS_NUMBER_STRING("limit")),
    },
  )
  @ValidateIf((o) => typeof o.limit !== "number")
  limit: number;

  constructor(request: GetHistoryRequestProps) {
    this.lastEvaluatedKey = request.lastEvaluatedKey;
    this.limit = request.limit;
  }
}
