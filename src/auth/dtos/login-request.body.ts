import { IsString, MinLength } from 'class-validator';

export default class LoginRequestBody {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;
}
