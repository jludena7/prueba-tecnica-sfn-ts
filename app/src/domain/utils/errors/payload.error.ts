import BodyErrorInterface from "./interfaces/body-error.interface";
import { HTTP_STATUS } from "../constants/constants";

export default class PayloadError extends Error {
  public readonly httpCode: number;
  public errorBody: BodyErrorInterface;

  constructor(errorBody: BodyErrorInterface) {
    super(errorBody.message);
    this.errorBody = errorBody;
    this.httpCode = HTTP_STATUS.CODE_400;
  }
}
