import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    try {
      await validateOrReject(object, { skipMissingProperties: true });
    } catch (errors) {
      throw new BadRequestException(this.buildErrorMessage(errors));
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private buildErrorMessage(errors: ValidationError[]): string {
    return errors
      .map(error => this.formatError(error))
      .join('; ');
  }

  private formatError(error: ValidationError): string {
    if (error.children && error.children.length) {
      return error.children.map(child => this.formatError(child)).join('; ');
    }
    return `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`;
  }
}
