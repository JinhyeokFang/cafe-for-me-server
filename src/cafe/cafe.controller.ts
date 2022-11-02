import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { debug } from 'console';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import CreateCafeRequestBody from 'src/cafe/dtos/create-cafe-request.body';
import UploadImageInfoDTO from 'src/image/dtos/upload-image-info.dto';
import ImageInterceptor from 'src/image/image.interceptor';
import { ImageService } from 'src/image/image.service';
import Token from 'src/interfaces/token';
import { CafeService } from './cafe.service';
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
            openHour, openMinute,
            closeHour, closeMinute,
            closeDay,
        } = createCafeRequestBody;
        const { userId } = req.user as Token;
        const imagesInfo: UploadImageInfoDTO[] = [];

        for (let image of images) {
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
            openHour, openMinute,
            closeHour, closeMinute,
            closeDay,
            images: imageUrls,
            uploaderId: userId,
        });
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
        }
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
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    public async deleteCafe(@Param('id') id) {
        await this.cafeService.deleteCafe({
            id,
        });
    }
}
