import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import GeoJson from './location';

export type CafeDocument = Cafe & Document;

@Schema()
export class Cafe {
    @Prop()
    name: string;

    @Prop({
        type: {
            type: String,
        },
        coordinates: [Number],
    })
    location: GeoJson;

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
