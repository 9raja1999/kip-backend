import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RpcValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
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

      throw new RpcException({
        statusCode: 422,
        data: errorMessages,
      });
    }

    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
