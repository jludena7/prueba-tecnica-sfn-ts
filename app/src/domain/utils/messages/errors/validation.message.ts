import BodyErrorInterface from "../../errors/interfaces/body-error.interface";

export const VALIDATION_MESSAGES = {
  IS_NOT_EMPTY: (field: string) =>
    ({
      error: "IS_NOT_EMPTY",
      message: `El campo '${field}' no debe ser vacio`,
    }) as BodyErrorInterface,

  MAX_LENGTH: (field: string, maxLength: number) =>
    ({
      error: "MAX_LENGTH",
      message: `El campo '${field}' no debe ser mayor a ${maxLength} caracteres`,
    }) as BodyErrorInterface,

  IS_ARRAY: (field: string) =>
    ({
      error: "IS_ARRAY",
      message: `El campo '${field}' no debe ser una lista`,
    }) as BodyErrorInterface,

  IS_NOT_ARRAY_EMPTY: (field: string) =>
    ({
      error: "IS_NOT_ARRAY_EMPTY",
      message: `El campo '${field}' no debe ser vacio`,
    }) as BodyErrorInterface,

  IS_NUMBER_STRING: (field: string) =>
    ({
      error: "IS_NUMBER_STRING",
      message: `El campo '${field}' debe ser numérico`,
    }) as BodyErrorInterface,
  IS_STRING: (field: string) =>
    ({
      error: "IS_STRING",
      message: `El campo '${field}' debe ser string`,
    }) as BodyErrorInterface,
};
