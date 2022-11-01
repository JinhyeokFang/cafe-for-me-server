import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModel } from 'src/models/image.model';
import { ImageService } from './image.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      ImageModel
    ]),
  ],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
