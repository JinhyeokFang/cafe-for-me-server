import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import * as compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService = app.get(ConfigService);
    const port = parseInt(configService.get('PORT'), 10);
    const wildcard_address = '0.0.0.0';
    app.use(compression());
    app.use(helmet());
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(port, wildcard_address);
}
bootstrap();
