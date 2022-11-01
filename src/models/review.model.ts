import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema()
export class Review {
    @Prop()
    cafeId: ObjectId;

    @Prop()
    uploaderId: ObjectId;

    @Prop()
    rate: number;

    @Prop()
    comment: string;

    @Prop()
    images: ObjectId[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export const ReviewModel: ModelDefinition = {
    name: Review.name,
    schema: ReviewSchema
};
