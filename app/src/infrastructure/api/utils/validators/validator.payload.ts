import { validate, ValidationError } from "class-validator";
import { NUMBER } from "../../../../domain/utils/constants/constants";
import PayloadError from "../../../../domain/utils/errors/payload.error";
import BodyErrorInterface from "../../../../domain/utils/errors/interfaces/body-error.interface";

export interface ValidatorRequestInterface {
  hasError: boolean;
  bodyError: BodyErrorInterface;
}

export default class ValidatorPayload {
  static async run(params: object, options: object = {}): Promise<void> {
    const error = await ValidatorPayload.validate(params, options);
    if (error.hasError) {
      throw new PayloadError(error.bodyError);
    }
  }

  static async validate(
    params: object,
    options: object = {},
  ): Promise<ValidatorRequestInterface> {
    const validErrors = await validate(params, options);
    if (validErrors.length > 0) {
      const errors = ValidatorPayload.parseErrors(validErrors);
      return {
        hasError: true,
        bodyError: errors[NUMBER.ZERO],
      };
    }

    return {
      hasError: false,
      bodyError: null,
    };
  }

  private static parseErrors(
    validErrors: ValidationError[],
  ): BodyErrorInterface[] {
    let response: BodyErrorInterface[] = [];

    validErrors.forEach((error: ValidationError): void => {
      if (error.constraints) {
        const arrayConstraints = Object.values(error.constraints);
        arrayConstraints.forEach((bodyError: string): void => {
          response.push(JSON.parse(bodyError));
        });
      }

      if (error.children.length > 0) {
        const responseArray: BodyErrorInterface[] =
          ValidatorPayload.parseErrors(error.children);
        response = [...response, ...responseArray];
      }
    });

    return response;
  }
}
