import { IsString } from 'class-validator';

export default class EditCafeImageRequestBody {
  @IsString()
  id: string;

  imageIndex: number;

  @IsString()
  imageURL: string;
}
