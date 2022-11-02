import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cafe } from 'src/models/cafe.model';
import { Image } from 'src/models/image.model';
import CreateCafeDTO from './dtos/create-cafe.dto';
import DeleteCafeDTO from './dtos/delete-cafe.dto';
import EditCafeDTO from './dtos/edit-cafe.dto';
import GetCafesByCafeNameDTO from './dtos/get-cafes-by-cafe-name.dto';
import GetCafesByUserIdDTO from './dtos/get-cafes-by-userid.dto';

@Injectable()
export class CafeService {
    constructor(
        @InjectModel(Cafe.name) private cafeModel: Model<Cafe>,
        @InjectModel(Image.name) private imageModel: Model<Image>,
    ) {}

    public async createCafe(createCafeDTO: CreateCafeDTO): Promise<void> {
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

    public async getCafesByCafeName(getCafesByCafeNameDTO: GetCafesByCafeNameDTO): Promise<Cafe[]> {
        const { name } = getCafesByCafeNameDTO;
        const cafes: Cafe[] = await this.cafeModel.find({
            name: {
                '$regex' : name, 
                '$options' : 'i',
            },
        });
        return cafes;
    }

    public async getCafesByUserId(getCafesByUserIdDTO: GetCafesByUserIdDTO): Promise<Cafe[]> {
        const { userId } = getCafesByUserIdDTO;
        const cafes: Cafe[] = await this.cafeModel.find({
            uploaderId: userId,
        });
        return cafes;
    }

    public async editCafe(editCafeDTO: EditCafeDTO) {
        const {
            id,
            name,
            latitude, longitude,
            openHour, openMinute,
            closeHour, closeMinute, closeDay,
        } = editCafeDTO;
        await this.cafeModel.updateOne({
            _id: id,
        }, {
            $set: {
                name,
                latitude, longitude,
                openHour, openMinute,
                closeHour, closeMinute, closeDay,
            }
        })
    }

    // public async editCafeImage();
    
    public async deleteCafe(deleteCafeDTO: DeleteCafeDTO) {
        const { id } = deleteCafeDTO;
        await this.cafeModel.deleteOne({
            _id: id,
        });
    }
    
    // public async deleteCafeImage();
}
