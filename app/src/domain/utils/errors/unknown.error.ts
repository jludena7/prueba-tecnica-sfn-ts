import BodyErrorInterface from "./interfaces/body-error.interface";
import { ERROR_MESSAGE, HTTP_STATUS, TAG_ERROR } from "../constants/constants";

export default class UnknownError extends Error {
  public readonly httpCode: number;
  public errorBody: BodyErrorInterface;

  constructor() {
    super(ERROR_MESSAGE.UNKNOWN_ERROR);
    this.errorBody = {
      error: TAG_ERROR.ERROR,
      message: ERROR_MESSAGE.UNKNOWN_ERROR,
    };
    this.httpCode = HTTP_STATUS.CODE_500;
  }
}
