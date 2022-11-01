import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModel } from 'src/models/user.model';
import getJwtModule from './jwt-verification.module';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            UserModel
        ]),
        getJwtModule(),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
