import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cafe } from 'src/models/cafe.model';
import GeoJson from 'src/models/location';
import CreateCafeDTO from './dtos/create-cafe.dto';
import DeleteCafeDTO from './dtos/delete-cafe.dto';
import EditCafeDTO from './dtos/edit-cafe.dto';
import GetCafesByCafeNameDTO from './dtos/get-cafes-by-cafe-name.dto';
import GetCafesByUserIdDTO from './dtos/get-cafes-by-userid.dto';

@Injectable()
export class CafeService {
    constructor(
        @InjectModel(Cafe.name) private cafeModel: Model<Cafe>,
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

        const location: GeoJson = {
            type: 'Point',
            coordinates: [parseInt(latitude.toString(), 10), parseInt(longitude.toString(), 10)],
        };

        const cafeInstance = await this.cafeModel.create({
            name,
            location,
            openHour, openMinute,
            closeHour, closeMinute, closeDay,
            images,
            uploaderId,
        });

        Logger.debug({
            name,
            location,
            openHour, openMinute,
            closeHour, closeMinute, closeDay,
            images,
            uploaderId,
        })
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

        const location = {
            type: 'Point',
            coordinates: [latitude, longitude],
        };

        await this.cafeModel.updateOne({
            _id: id,
        }, {
            $set: {
                name,
                openHour, openMinute,
                closeHour, closeMinute, closeDay,
                location: latitude && longitude ? location : undefined,
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
