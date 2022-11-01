import { DynamicModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

export default function getJwtModule(): DynamicModule {
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
    return jwtModule;
}