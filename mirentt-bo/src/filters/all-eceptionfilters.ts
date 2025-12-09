import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.status || 500; // Si exception n'a pas de status, utilise 500
    const message = exception.message || 'Internal server error'; // Message par défaut si pas d'erreur précise
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
