import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CafeDocument = Cafe & Document;

@Schema()
export class Cafe {
    @Prop()
    name: string;

    @Prop()
    latitude: number;

    @Prop()
    longitude: number;

    @Prop()
    openHour: number;

    @Prop()
    openMinute: number;

    @Prop()
    closeHour: number;

    @Prop()
    closeMinute: number;

    @Prop()
    closeDay: string;

    @Prop()
    images: string[];

    @Prop()
    uploaderId: string;
}

export const CafeSchema = SchemaFactory.createForClass(Cafe);

export const CafeModel: ModelDefinition = {
    name: Cafe.name,
    schema: CafeSchema
}
