import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewModel } from 'src/models/review.model';
import { ImageModule } from 'src/image/image.module';
import ModuleWithModel from 'src/base/mongoose-module';
import imageUploadModule from 'src/image/image-upload.module';

@ModuleWithModel({
  imports: [imageUploadModule, ImageModule],
  providers: [ReviewService],
  controllers: [ReviewController],
  models: [ReviewModel],
})
export class ReviewModule {}
