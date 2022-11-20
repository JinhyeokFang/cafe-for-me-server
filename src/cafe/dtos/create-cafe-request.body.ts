import { IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';

export default class CreateCafeRequestBody {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumberString()
  @IsOptional()
  latitude?: number;

  @IsNumberString()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumberString()
  openHour: number;

  @IsNumberString()
  openMinute: number;

  @IsNumberString()
  closeHour: number;

  @IsNumberString()
  closeMinute: number;

  @IsString()
  closeDay: string;

  @IsString()
  tags: string;
}
