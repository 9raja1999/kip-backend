import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const createValidationPipe = () => {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const errorMessages: Record<string, string[]> = {};

      function collectErrors(errs: ValidationError[], parentPath = ''): void {
        errs.forEach((err) => {
          const path = parentPath
            ? `${parentPath}.${err.property}`
            : err.property;
          if (err.constraints) {
            errorMessages[path] = Object.values(err.constraints);
          }
          if (err.children && err.children.length > 0) {
            collectErrors(err.children, path);
          }
        });
      }

      collectErrors(errors);
      return new UnprocessableEntityException({
        statusCode: 422,
        data: errorMessages,
      });
    },
  });
};
