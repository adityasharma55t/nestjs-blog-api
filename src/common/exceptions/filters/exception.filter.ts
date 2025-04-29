import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message: string | object = 'Internal Server Error';
    let error: string = 'Internal Server Error';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const res = exceptionResponse as any;
        message = res.message || message;
        error = res.error || error;
      }
    }
    if (status > 500)
      this.logger.error(
        `Exception thrown at ${request.method} ${request.url}: ${JSON.stringify(message)}`,
      );
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
      error,
    });
  }
}
