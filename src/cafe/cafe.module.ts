import { Module } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { CafeController } from './cafe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from 'src/image/image.module';
import getImageUploadModule from 'src/image/image-upload.module';
import { CafeModel } from 'src/models/cafe.model';
import { ImageModel } from 'src/models/image.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            CafeModel,
            ImageModel,
        ]),
        getImageUploadModule(),
        ImageModule,
    ],
    providers: [CafeService],
    controllers: [CafeController],
})
export class CafeModule {}
