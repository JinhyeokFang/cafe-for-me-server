import { IsString } from 'class-validator';

export default class EditCafeRequestBody {
  @IsString()
  id: string;

  name?: string;

  latitude?: number;

  longitude?: number;

  openHour?: number;

  openMinute?: number;

  closeHour?: number;

  closeMinute?: number;

  closeDay?: string;
}
