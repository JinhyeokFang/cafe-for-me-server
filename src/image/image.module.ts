import { ConfigModule } from '@nestjs/config';
import ModuleWithModel from 'src/base/mongoose-module';
import { ImageModel } from 'src/models/image.model';
import { ImageService } from './image.service';

@ModuleWithModel({
  imports: [ConfigModule],
  providers: [ImageService],
  exports: [ImageService],
  models: [ImageModel],
})
export class ImageModule {}
