import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

const jwtModule = JwtModule.registerAsync({
  useFactory: (configService: ConfigService) => {
    return {
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get<string | number>('JWT_EXPIRE'),
      },
    };
  },
  inject: [ConfigService],
});

export default jwtModule;
