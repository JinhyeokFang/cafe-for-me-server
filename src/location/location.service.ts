// https://developers.kakao.com/docs/latest/ko/local/dev-guide

import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";

@Injectable()
export class LocationService {
    constructor(
        private readonly httpService: HttpService,
    ) {}

    public async addressToCoordinates(address: string): Promise<{ latitude: number, longitude: number } | null> {
        const url = '/v2/local/search/address.json';
        const parameters = {
            query: address,
        };
        const responseData = await this.request(url, parameters);
        const locationData = responseData.documents[0];
        const isLocationExist = locationData !== undefined;
        if (!isLocationExist)
            return null;
        return {
            latitude: locationData.y,
            longitude: locationData.x,
        }
    }

    public async coordinatesToAddress(latitude: number, longitude: number): Promise<string | null> {
        const url = '/v2/local/geo/coord2address.json';
        const parameters = {
            x: longitude,
            y: latitude,
        };
        const responseData = await this.request(url, parameters);
        const locationData = responseData.documents[0];
        const isLocationExist = locationData !== undefined;
        if (!isLocationExist)
            return null;
        return locationData.address.address_name;
    }

    public async searchLocationData(keyword: string) {
        const url = '/v2/local/search/keyword.json';
        const parameters = {
            query: keyword,
        };
        const responseData = await this.request(url, parameters);
        const locationData = responseData.documents;
        const isLocationExist = locationData !== undefined;
        if (!isLocationExist)
            return null;

        const locations = [];
        for (const location of locationData) {
            locations.push({
                name: location.place_name,
                address: location.road_address_name,
                latitude: location.y,
                longitude: location.x,
            });
        }
        return locations;
    }

    private async request(url: string, parameters: Record<string, unknown>, requestErrorMessage?: string) {
        const requestConfig = {
            params: parameters,
        };
        const { data } = await firstValueFrom(
          this.httpService
            .get(url, requestConfig)
            .pipe(
                catchError((error) => {
                    Logger.error(error);
                    const errorResult = {
                        success: false,
                        error,
                        message: requestErrorMessage
                    };
                    throw new Error(JSON.stringify(errorResult));
                }
            ),
          ),
        );
        return data;
    }
}