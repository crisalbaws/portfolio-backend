import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException && exception.getStatus() === HttpStatus.BAD_REQUEST) {
      const errors: ValidationError[] = exception.getResponse()['message'];

      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: this.extractValidationErrors(errors),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }

  private extractValidationErrors(errors: ValidationError[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    errors.forEach((error) => {
      const property = error.property;
      Object.entries(error.constraints).forEach(([constraintKey, constraint]) => {
        result[property] = result[property] || [];
        result[property].push(constraint);
      });
    });

    return result;
  }
}
