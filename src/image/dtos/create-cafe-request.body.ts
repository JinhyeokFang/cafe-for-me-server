import { IsNumber, IsNumberString, IsString, Max, Min, MinLength } from "class-validator";

export default class CreateCafeRequestBody {
    @IsString()
    @MinLength(3)
    name: string;

    @IsNumberString()
    latitude: number;

    @IsNumberString()
    longitude: number;

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
}
