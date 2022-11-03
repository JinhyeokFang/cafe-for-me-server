import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import UploadImageInfoDTO from 'src/image/dtos/upload-image-info.dto';
import ImageInterceptor from 'src/image/image.interceptor';
import { ImageService } from 'src/image/image.service';
import Token from 'src/interfaces/token';
import CreateReviewRequestBody from './dtos/create-review-request.body';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly imageService: ImageService,
    ) {}

    @UseGuards(JwtGuard)
    @Post()
    @UseInterceptors(ImageInterceptor)
    public async createReview(
        @Req() req: Request, 
        @Body() body: CreateReviewRequestBody,
        @UploadedFiles() images: Array<Express.Multer.File>,
    ) {
        const { cafeId, rate, comment } = body;
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

        await this.reviewService.createReview({
            images: imageUrls,
            uploaderId: userId,
            cafeId,
            rate,
            comment,
        });
    }

    @Get(':cafeId')
    public async getReviewsByCafeId(@Param('cafeId') cafeId: string) {
        const reviews = await this.reviewService.getReviewsByCafeId({
            cafeId,
        });
        return {
            success: true,
            reviews,
        };
    }

    @UseGuards(JwtGuard)
    @Get('')
    public async getCafesByUserId(@Req() req: Request) {
        const { userId } = req.user as Token;
        const reviews = await this.reviewService.getReviewsByUploaderId({
            uploaderId: userId,
        });
        return {
            success: true,
            reviews,
        };
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    public async deleteReview(@Param('id') id) {
        await this.reviewService.deleteReview({
            id,
        });
        return {
            success: true,
        };
    }
}
