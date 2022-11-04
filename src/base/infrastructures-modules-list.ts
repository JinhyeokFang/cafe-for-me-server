import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const infrastructureModulesList: DynamicModule[] = [
  ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10,
  }),
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI'),
    }),
    inject: [ConfigService],
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'images'),
  }),
];

export default infrastructureModulesList;
