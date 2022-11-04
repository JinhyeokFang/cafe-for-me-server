import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema()
export class Review {
  @Prop()
  cafeId: string;

  @Prop()
  uploaderId: string;

  @Prop()
  rate: number;

  @Prop()
  comment: string;

  @Prop()
  images: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export const ReviewModel: ModelDefinition = {
  name: Review.name,
  schema: ReviewSchema,
};
