import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';
import { CafeModule } from './cafe/cafe.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { LocationModule } from './location/location.module';
import infrastructureModulesList from './base/infrastructures-modules-list';

@Module({
  imports: [
    ...infrastructureModulesList,
    ImageModule,
    CafeModule,
    AuthModule,
    ReviewModule,
    LocationModule,
  ],
})
export class AppModule {}
