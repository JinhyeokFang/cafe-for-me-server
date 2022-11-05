import { Body, ConflictException, Controller, HttpException, InternalServerErrorException, Logger, NotFoundException, Post } from '@nestjs/common';
import ServiceError from 'src/base/service-error';
import { AuthService, AuthServiceErrorCode } from './auth.service';
import LoginRequestBody from './dtos/login-request.body';
import RegisterRequestBody from './dtos/register-request.body';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(@Body() loginRequestBody: LoginRequestBody) {
    const { name, password } = loginRequestBody;
    try {
      const token = await this.authService.login({
        name,
        password,
      });
      return {
        success: true,
        token,
      };
    } catch (err) {
      if (
        err instanceof ServiceError &&
        err.code == AuthServiceErrorCode.UserNotFound
      )
        throw new NotFoundException(
          {
            success: false,
            message: err.message,
          },
        );
      Logger.error(err);
      throw new InternalServerErrorException(
        {
          success: false,
          message: 'Internal Server Error',
        },
      );
    }
  }

  @Post('register')
  public async register(@Body() registerRequestBody: RegisterRequestBody) {
    const { name, password, nickname } = registerRequestBody;
    try {
      await this.authService.registerNewUser({
        name,
        password,
        nickname,
      });
      return {
        success: true,
      };
    } catch (err) {
      if (
        err instanceof ServiceError &&
        err.code == AuthServiceErrorCode.UserAlreadyExist
      )
        throw new ConflictException(
          {
            success: false,
            message: err.message,
          },
        );
      Logger.error(err);
      throw new InternalServerErrorException(
        {
          success: false,
          message: 'Internal Server Error',
        },
      );
    }
  }
}
