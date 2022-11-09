import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';
import { Image } from 'src/models/image.model';
import UploadImageInfoDTO from './dtos/upload-image-info.dto';
import UploadMultipleImagesInfo from './dtos/upload-multiple-images-info.dto';

@Injectable()
export class ImageService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
  ) {}

  public async uploadImageInfo(
    uploadImageInfoDTO: UploadImageInfoDTO,
  ): Promise<string> {
    const { imagename, userId } = uploadImageInfoDTO;
    const rootUrl = this.configService.get<string>('URL');
    const imageUrl = 'https://server.jinhy.uk/api/static/' + imagename;
    const imageInstance = await this.imageModel.create({
      imageUrl,
      uploaderId: userId,
    });
    await imageInstance.save();
    return imageInstance.imageUrl;
  }

  public async uploadMultipleImagesInfo(
    uploadMultipleImagesInfo: UploadMultipleImagesInfo,
  ): Promise<string[]> {
    const { images } = uploadMultipleImagesInfo;
    const imageUrls: string[] = [];
    for (const image of images) {
      const imageUrl = await this.uploadImageInfo(image);
      imageUrls.push(imageUrl);
    }
    return imageUrls;
  }
}
