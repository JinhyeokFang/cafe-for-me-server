import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop()
  imageUrl: string;

  @Prop()
  uploaderId: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

export const ImageModel: ModelDefinition = {
  name: Image.name,
  schema: ImageSchema,
};
