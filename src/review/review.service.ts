import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from 'src/models/review.model';
import CreateReviewDTO from './dtos/create-review-dto';
import DeleteReviewDTO from './dtos/delete-review.dto';
import GetReviewsByCafeIdDTO from './dtos/get-reviews-by-cafeid.dto';
import GetReviewsByUploaderIdDTO from './dtos/get-reviews-by-uploaderid.dto';

export enum ReviewServiceErrorCode {
  ReviewNotFound,
}

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  public async createReview(createReviewDTO: CreateReviewDTO) {
    const { cafeId, uploaderId, rate, comment, images } = createReviewDTO;
    const reviewInstance = await this.reviewModel.create({
      cafeId,
      uploaderId,
      rate,
      comment,
      images,
    });
    await reviewInstance.save();
  }

  public async getReviewsByCafeId(
    getReviewsByCafeIdDTO: GetReviewsByCafeIdDTO,
  ): Promise<Review[]> {
    const { cafeId } = getReviewsByCafeIdDTO;
    const reviews: Review[] = await this.reviewModel.find({
      cafeId: {
        $regex: cafeId,
        $options: 'i',
      },
    });
    return reviews;
  }

  public async getReviewsByUploaderId(
    getReviewsByUploaderIdDTO: GetReviewsByUploaderIdDTO,
  ): Promise<Review[]> {
    const { uploaderId } = getReviewsByUploaderIdDTO;
    const reviews: Review[] = await this.reviewModel.find({
      uploaderId,
    });
    return reviews;
  }

  public async deleteReview(deleteReviewDTO: DeleteReviewDTO) {
    const { id, userId } = deleteReviewDTO;
    await this.reviewModel.deleteOne({
      _id: id,
      uploaderId: userId,
    });
  }
}
