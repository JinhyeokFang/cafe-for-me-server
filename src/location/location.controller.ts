import { Body, Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
    ) {}

    @Get(':keyword')
    public async locationSearch(@Param('keyword') keyword: string) {
        const location = await this.locationService.searchLocationData(keyword);
        return {
            success: true,
            location,
        };
    }
}
