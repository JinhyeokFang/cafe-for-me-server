import { IsString, MinLength } from 'class-validator';

export default class RegisterRequestBody {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  nickname: string;
}
