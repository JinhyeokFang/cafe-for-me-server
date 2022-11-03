import { Body, Controller, Delete, Get, Logger, Param, ParseFloatPipe, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import CreateCafeRequestBody from 'src/cafe/dtos/create-cafe-request.body';
import UploadImageInfoDTO from 'src/image/dtos/upload-image-info.dto';
import ImageInterceptor from 'src/image/image.interceptor';
import { ImageService } from 'src/image/image.service';
import Token from 'src/interfaces/token';
import { CafeService } from './cafe.service';
import EditCafeImageRequestBody from './dtos/edit-cafe-image-request.body';
import EditCafeRequestBody from './dtos/edit-cafe-request.body';

@Controller('cafe')
export class CafeController {
    constructor(
        private readonly cafeService: CafeService,
        private readonly imageService: ImageService,
    ) {}
    
    @UseGuards(JwtGuard)
    @Post('')
    @UseInterceptors(ImageInterceptor)
    public async createCafe(
        @Req() req: Request, 
        @Body() createCafeRequestBody: CreateCafeRequestBody,
        @UploadedFiles() images: Array<Express.Multer.File>,
    ) {
        const {
            name,
            latitude, longitude,
            address,
            openHour, openMinute,
            closeHour, closeMinute,
            closeDay,
        } = createCafeRequestBody;
        const { userId } = req.user as Token;
        const imagesInfo: UploadImageInfoDTO[] = [];

        for (const image of images) {
            imagesInfo.push({
                imagename: image.filename,
                userId,
            });
        }

        const imageUrls = await this.imageService.uploadMultipleImagesInfo({
            images: imagesInfo,
        });

        await this.cafeService.createCafe({
            name,
            latitude, longitude,
            address,
            openHour, openMinute,
            closeHour, closeMinute,
            closeDay,
            images: imageUrls,
            uploaderId: userId,
        });

        return {
            success: true,
        }
    }
    
    @Get(':name')
    public async getCafesByCafeName(@Param('name') name) {
        const cafes = await this.cafeService.getCafesByCafeName({
            name,
        });
        return {
            success: true,
            cafes,
        };
    }

    @UseGuards(JwtGuard)
    @Get('')
    public async getCafesByUserId(@Req() req: Request) {
        const { userId } = req.user as Token;
        const cafes = await this.cafeService.getCafesByUserId({
            userId,
        });
        return {
            success: true,
            cafes,
        };
    }

    @UseGuards(JwtGuard)
    @Get('/location/:latitude/:longitude')
    public async getCafesByGeolocation(
        @Param('latitude', ParseFloatPipe) latitude, 
        @Param('longitude', ParseFloatPipe) longitude, 
        @Query('maxDistance', ParseFloatPipe) maxDistance
    ) {
        const cafes = await this.cafeService.getCafesByGeolocation({
            latitude,
            longitude,
            maxDistance,
        });
        return {
            success: true,
            cafes,
        };
    }
    
    @Get('address/:address')
    public async getCafesByAddress(@Param('address') address) {
        const cafes = await this.cafeService.getCafesByAddress({
            address,
        });
        return {
            success: true,
            cafes,
        };
    }

    @UseGuards(JwtGuard)
    @Patch()
    public async editCafe(@Body() body: EditCafeRequestBody) {
        const {
            id,
            name,
            latitude, longitude,
            openHour, openMinute,
            closeHour, closeMinute, closeDay,
        } = body;
        
        await this.cafeService.editCafe({
            id,
            name,
            latitude, longitude,
            openHour, openMinute,
            closeHour, closeMinute, closeDay,
        });
        return {
            success: true,
        };
    }

    @UseGuards(JwtGuard)
    @Patch('image')
    public async editCafeImage(@Body() body: EditCafeImageRequestBody) {
        const { id, imageIndex, imageURL } = body;
        await this.cafeService.editCafeImage({
            id,
            imageIndex,
            imageURL,
        });
        return {
            success: true,
        };
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    public async deleteCafe(@Param('id') id) {
        await this.cafeService.deleteCafe({
            id,
        });
        return {
            success: true,
        };
    }

    @UseGuards(JwtGuard)
    @Delete(':id/image/:imageIndex')
    public async deleteCafeImage(@Param('id') id, @Param('imageIndex') imageIndex) {
        await this.cafeService.deleteCafeImage({
            id,
            imageIndex,
        });
        return {
            success: true,
        };
    }
}
