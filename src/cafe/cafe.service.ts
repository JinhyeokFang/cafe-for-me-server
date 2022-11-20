import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ServiceError from 'src/base/service-error';
import { Cafe } from 'src/models/cafe.model';
import GeoJson from 'src/models/location';
import CreateCafeDTO from './dtos/create-cafe.dto';
import DeleteCafeImageDTO from './dtos/delete-cafe-image.dto';
import DeleteCafeDTO from './dtos/delete-cafe.dto';
import EditCafeImageDTO from './dtos/edit-cafe-image.dto';
import EditCafeDTO from './dtos/edit-cafe.dto';
import { GetCafeByCafeIdDTO } from './dtos/get-cafe-by-cafeid.dto';
import GetCafesByAddressDTO from './dtos/get-cafes-by-address.dto';
import GetCafesByCafeNameDTO from './dtos/get-cafes-by-cafe-name.dto';
import GetCafesByGeolocationDTO from './dtos/get-cafes-by-geolocation.dto';
import GetCafesByUserIdDTO from './dtos/get-cafes-by-userid.dto';

export enum CafeServiceErrorCode {
  CafeNotFound,
  ImageNotFound,
}

@Injectable()
export class CafeService {
  constructor(@InjectModel(Cafe.name) private cafeModel: Model<Cafe>) {}

  public async createCafe(createCafeDTO: CreateCafeDTO): Promise<void> {
    const {
      name,
      latitude,
      longitude,
      address,
      openHour,
      openMinute,
      closeHour,
      closeMinute,
      closeDay,
      images,
      uploaderId,
      tags,
    } = createCafeDTO;

    const location: GeoJson = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    const cafeInstance = await this.cafeModel.create({
      name,
      location,
      address,
      openHour,
      openMinute,
      closeHour,
      closeMinute,
      closeDay,
      images,
      uploaderId,
      tags,
    });

    await cafeInstance.save();
  }

  public async getCafesByCafeName(
    getCafesByCafeNameDTO: GetCafesByCafeNameDTO,
  ): Promise<Cafe[]> {
    const { name } = getCafesByCafeNameDTO;
    const cafes: Cafe[] = await this.cafeModel.find({
      name: {
        $regex: name,
        $options: 'i',
      },
    });
    return cafes;
  }

  public async getCafesByUserId(
    getCafesByUserIdDTO: GetCafesByUserIdDTO,
  ): Promise<Cafe[]> {
    const { userId } = getCafesByUserIdDTO;
    const cafes: Cafe[] = await this.cafeModel.find({
      uploaderId: userId,
    });
    return cafes;
  }

  public async getCafesByGeolocation(
    getCafesByGeolocationDTO: GetCafesByGeolocationDTO,
  ): Promise<Cafe[]> {
    const { latitude, longitude, maxDistance } = getCafesByGeolocationDTO;
    const coordinates: [number, number] = [latitude, longitude];
    const cafes: Cafe[] = await this.cafeModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates,
          },
          distanceField: 'distance',
          maxDistance,
          spherical: true,
        },
      },
    ]);
    return cafes;
  }

  public async getCafesByAddress(
    getCafesByAddressDTO: GetCafesByAddressDTO,
  ): Promise<Cafe[]> {
    const { address } = getCafesByAddressDTO;
    const cafes: Cafe[] = await this.cafeModel.find({
      address: {
        $regex: address,
        $options: 'i',
      },
    });
    return cafes;
  }

  public async getCafeByCafeId(
    getCafeByCafeIdDTO: GetCafeByCafeIdDTO,
  ): Promise<Cafe> {
    const { cafeId } = getCafeByCafeIdDTO;
    const cafe: Cafe = await this.cafeModel.findOne({
      _id: cafeId,
    });
    return cafe;
  }

  public async editCafe(editCafeDTO: EditCafeDTO) {
    const {
      id,
      name,
      latitude,
      longitude,
      openHour,
      openMinute,
      closeHour,
      closeMinute,
      closeDay,
    } = editCafeDTO;

    const location = {
      type: 'Point',
      coordinates: [latitude, longitude],
    };

    const isExist = await this.isCafeExist(id);
    if (!isExist)
      throw new ServiceError(
        CafeServiceErrorCode.CafeNotFound,
        `the cafe identified by ${id} does not exist`,
      );

    await this.cafeModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          name,
          openHour,
          openMinute,
          closeHour,
          closeMinute,
          closeDay,
          location: latitude && longitude ? location : undefined,
        },
      },
    );
  }

  private async isCafeExist(id: string) {
    const cafe = await this.cafeModel.findOne({
      _id: id,
    });
    return cafe !== null;
  }

  public async editCafeImage(editCafeImageDTO: EditCafeImageDTO) {
    const { id, imageIndex, imageURL } = editCafeImageDTO;

    const isExist = await this.isCafeImageExist(id, imageIndex);
    if (!isExist)
      throw new ServiceError(
        CafeServiceErrorCode.ImageNotFound,
        `the image does not exist`,
      );

    const setQuery: Record<string, unknown> = {};
    setQuery[`images.${imageIndex}`] = imageURL;

    await this.cafeModel.updateOne(
      {
        _id: id,
      },
      {
        $set: setQuery,
      },
    );
  }

  private async isCafeImageExist(
    id: string,
    imageIndex: number,
  ): Promise<boolean> {
    if (!this.isCafeExist(id))
      throw new ServiceError(
        CafeServiceErrorCode.CafeNotFound,
        `the cafe identified by ${id} does not exist`,
      );
    const cafe = await this.cafeModel.findOne({
      id,
    });
    const isImageExist = cafe.images.length < imageIndex;
    return isImageExist;
  }

  public async deleteCafe(deleteCafeDTO: DeleteCafeDTO) {
    const { id, userId } = deleteCafeDTO;

    const isExist = await this.isCafeExist(id);
    if (!isExist)
      throw new ServiceError(
        CafeServiceErrorCode.CafeNotFound,
        `the cafe identified by ${id} does not exist`,
      );

    await this.cafeModel.deleteOne({
      _id: id,
      uploaderId: userId,
    });
  }

  public async deleteCafeImage(deleteCafeImageDTO: DeleteCafeImageDTO) {
    const { id, imageIndex, userId } = deleteCafeImageDTO;

    const isExist = await this.isCafeImageExist(id, imageIndex);
    if (!isExist)
      throw new ServiceError(
        CafeServiceErrorCode.ImageNotFound,
        `the image does not exist`,
      );

    const setQuery: Record<string, unknown> = {};
    setQuery[`images.${imageIndex}`] = null;
    await this.cafeModel.updateOne(
      {
        _id: id,
        uploaderId: userId,
      },
      {
        $unset: setQuery,
      },
    );
    await this.cafeModel.updateOne(
      {
        _id: id,
        uploaderId: userId,
      },
      {
        $pull: {
          images: null,
        },
      },
    );
  }
}
