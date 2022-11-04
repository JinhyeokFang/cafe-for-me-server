import { IsNumberString, IsString } from 'class-validator';

export default class CreateReviewRequestBody {
  @IsString()
  cafeId: string;

  @IsNumberString()
  rate: number;

  @IsString()
  comment: string;
}
