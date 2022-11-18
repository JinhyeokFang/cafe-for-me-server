import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/auth/userid.decorator';
import UploadImageInfoDTO from 'src/image/dtos/upload-image-info.dto';
import ImageInterceptor from 'src/image/image.interceptor';
import { ImageService } from 'src/image/image.service';
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
    @UserId() userId: string,
    @Body() body: CreateReviewRequestBody,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const { cafeId, rate, comment } = body;
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
  public async getCafesByUserId(@UserId() userId: string) {
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
  public async deleteReview(@UserId() userId: string, @Param('id') id: string) {
    await this.reviewService.deleteReview({
      id,
      userId,
    });
    return {
      success: true,
    };
  }
}
