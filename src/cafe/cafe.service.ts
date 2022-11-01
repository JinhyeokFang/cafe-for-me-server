import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cafe } from 'src/models/cafe.model';
import { Image } from 'src/models/image.model';
import CreateCafeDTO from './dtos/create-cafe.dto';

@Injectable()
export class CafeService {
    constructor(
        @InjectModel(Cafe.name) private cafeModel: Model<Cafe>,
        @InjectModel(Image.name) private imageModel: Model<Image>,
    ) {}

    public async createCafe(createCafeDTO: CreateCafeDTO) {
        const {
            name,
            latitude, longitude,
            openHour, openMinute,
            closeHour, closeMinute, closeDay,
            images,
            uploaderId,
        } = createCafeDTO;

        const cafeInstance = await this.cafeModel.create({
            name,
            latitude, longitude,
            openHour, openMinute,
            closeHour, closeMinute, closeDay,
            images,
            uploaderId,
        });
        await cafeInstance.save();
    }

    // public async getCafesByCafeName();
    // public async getCafesByUserId();
    // public async editCafe();
    // public async editCafeImage();
    // public async deleteCafe();
    // public async deleteCafeImage();
}
