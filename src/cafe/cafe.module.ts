import { CafeService } from './cafe.service';
import { CafeController } from './cafe.controller';
import { ImageModule } from 'src/image/image.module';
import { CafeModel } from 'src/models/cafe.model';
import { ImageModel } from 'src/models/image.model';
import ModuleWithModel from 'src/base/mongoose-module';
import imageUploadModule from 'src/image/image-upload.module';
import { LocationModule } from 'src/location/location.module';

@ModuleWithModel({
  imports: [imageUploadModule, ImageModule, LocationModule],
  providers: [CafeService],
  controllers: [CafeController],
  models: [CafeModel, ImageModel],
})
export class CafeModule {}
