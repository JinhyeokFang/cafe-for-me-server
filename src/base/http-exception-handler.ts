import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export default class HttpExceptionHandler implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const statusCode = exception.getStatus();

    response.status(statusCode).json({
      success: false,
      error: {
        message: exception.cause || exception.message,
        statusCode,
      },
    });
  }
}
