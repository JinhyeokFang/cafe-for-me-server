import { HttpModule } from '@nestjs/axios';
import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

const kakaoApiRequestorModule: DynamicModule = HttpModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        const baseURL = 'https://dapi.kakao.com';
        const kakaoApiKey = configService.get<string>('KAKAO_API_KEY');
        const Authorization = `KakaoAK ${kakaoApiKey}`;   

        return {
            baseURL,
            headers: {
                Authorization,
            },
        }
    },
    inject: [ConfigService],
});

export default kakaoApiRequestorModule;