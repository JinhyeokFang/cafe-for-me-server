import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { ConfigModule } from '@nestjs/config';
import kakaoApiRequestorModule from './kakao-api-requestor.module';

@Module({
  imports: [ConfigModule, kakaoApiRequestorModule],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
