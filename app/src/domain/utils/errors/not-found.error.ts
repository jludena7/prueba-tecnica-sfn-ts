import BodyErrorInterface from "./interfaces/body-error.interface";
import { ERROR_MESSAGE, HTTP_STATUS, TAG_ERROR } from "../constants/constants";

export default class NotFoundError extends Error {
  public readonly httpCode: number;
  public errorBody: BodyErrorInterface;

  constructor() {
    super(ERROR_MESSAGE.NOT_FOUND_ERROR);
    this.errorBody = {
      error: TAG_ERROR.ERROR,
      message: ERROR_MESSAGE.NOT_FOUND_ERROR,
    };
    this.httpCode = HTTP_STATUS.CODE_404;
  }
}
