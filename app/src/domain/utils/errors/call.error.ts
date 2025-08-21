import BodyErrorInterface from "./interfaces/body-error.interface";
import { TAG_ERROR } from "../constants/constants";

export default class CallError extends Error {
  public readonly httpCode: number;
  public errorBody: BodyErrorInterface;

  constructor(statusCode: number, message: string) {
    super(message);
    this.errorBody = {
      error: TAG_ERROR.ERROR_CALL,
      message: message,
    };
    this.httpCode = statusCode;
  }
}
