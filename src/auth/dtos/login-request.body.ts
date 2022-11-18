import { IsString, MinLength } from 'class-validator';

export default class LoginRequestBody {
  @IsString()
  name: string;

  @IsString()
  password: string;
}
