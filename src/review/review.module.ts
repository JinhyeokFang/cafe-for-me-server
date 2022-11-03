import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModel } from 'src/models/review.model';
import getImageUploadModule from 'src/image/image-upload.module';
import { ImageModule } from 'src/image/image.module';

@Module({
    imports: [
        getImageUploadModule(),
        MongooseModule.forFeature([
            ReviewModel,
        ]),
        ImageModule,
    ],
    providers: [ReviewService],
    controllers: [ReviewController],
})
export class ReviewModule {}
