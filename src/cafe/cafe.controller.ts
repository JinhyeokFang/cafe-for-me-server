import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/auth/userid.decorator';
import CreateCafeRequestBody from 'src/cafe/dtos/create-cafe-request.body';
import UploadImageInfoDTO from 'src/image/dtos/upload-image-info.dto';
import ImageInterceptor from 'src/image/image.interceptor';
import { ImageService } from 'src/image/image.service';
import { LocationService } from 'src/location/location.service';
import { CafeService } from './cafe.service';
import EditCafeImageRequestBody from './dtos/edit-cafe-image-request.body';
import EditCafeRequestBody from './dtos/edit-cafe-request.body';

@Controller('cafe')
export class CafeController {
  constructor(
    private readonly cafeService: CafeService,
    private readonly imageService: ImageService,
    private readonly locationService: LocationService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('')
  @UseInterceptors(ImageInterceptor)
  public async createCafe(
    @UserId() userId: string,
    @Body() createCafeRequestBody: CreateCafeRequestBody,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const {
      name,
      openHour,
      openMinute,
      closeHour,
      closeMinute,
      closeDay,
      tags,
    } = createCafeRequestBody;
    let {
      latitude,
      longitude,
      address,
    } = createCafeRequestBody;
    const imagesInfo: UploadImageInfoDTO[] = [];

    if (!(latitude && longitude) && !address)
      throw new BadRequestException({
        message: `must request with the coordinate data or the address`,
      });

    if (!address) {
      address = await this.locationService.coordinatesToAddress(latitude, longitude)
      address = address ? address : '';
    }

    if (!(latitude && longitude)) {
      const coordinates = await this.locationService.addressToCoordinates(address);
      if (coordinates === null)
        throw new BadRequestException({
          message: `given address is wrong`,
        });
      latitude = coordinates.latitude;
      longitude = coordinates.longitude;
    }

    for (const image of images) {
      imagesInfo.push({
        imagename: image.filename,
        userId,
      });
    }

    const imageUrls = await this.imageService.uploadMultipleImagesInfo({
      images: imagesInfo,
    });

    await this.cafeService.createCafe({
      name,
      latitude,
      longitude,
      address,
      openHour,
      openMinute,
      closeHour,
      closeMinute,
      closeDay,
      images: imageUrls,
      uploaderId: userId,
      tags: tags.split(','),
    });

    return {
      success: true,
    };
  }

  @Get('/location/:latitude/:longitude')
  public async getCafesByGeolocation(
    @Param('latitude', ParseFloatPipe) latitude: number,
    @Param('longitude', ParseFloatPipe) longitude: number,
    @Query('maxDistance', ParseFloatPipe) maxDistance: number,
  ) {
    const cafes = await this.cafeService.getCafesByGeolocation({
      latitude,
      longitude,
      maxDistance,
    });
    return {
      success: true,
      cafes,
    };
  }

  @Get('address/:address')
  public async getCafesByAddress(@Param('address') address: string) {
    const cafes = await this.cafeService.getCafesByAddress({
      address,
    });
    return {
      success: true,
      cafes,
    };
  }

  @Get('id/:id')
  public async getCafeByCafeId(@Param('id') cafeId: string) {
    const cafe = await this.cafeService.getCafeByCafeId({
      cafeId,
    });
    return {
      success: true,
      cafe,
    };
  }

  @Get(':name')
  public async getCafesByCafeName(@Param('name') name: string) {
    const cafes = await this.cafeService.getCafesByCafeName({
      name,
    });
    return {
      success: true,
      cafes,
    };
  }

  @UseGuards(JwtGuard)
  @Get('')
  public async getCafesByUserId(@UserId() userId: string) {
    const cafes = await this.cafeService.getCafesByUserId({
      userId,
    });
    return {
      success: true,
      cafes,
    };
  }

  @UseGuards(JwtGuard)
  @Patch()
  public async editCafe(@Body() body: EditCafeRequestBody) {
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
    } = body;

    await this.cafeService.editCafe({
      id,
      name,
      latitude,
      longitude,
      openHour,
      openMinute,
      closeHour,
      closeMinute,
      closeDay,
    });
    return {
      success: true,
    };
  }

  @UseGuards(JwtGuard)
  @Patch('image')
  public async editCafeImage(@Body() body: EditCafeImageRequestBody) {
    const { id, imageIndex, imageURL } = body;
    await this.cafeService.editCafeImage({
      id,
      imageIndex,
      imageURL,
    });
    return {
      success: true,
    };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async deleteCafe(
    @UserId() userId: string,
    @Param('id') id: string
  ) {
    await this.cafeService.deleteCafe({
      id,
      userId,
    });
    return {
      success: true,
    };
  }

  @UseGuards(JwtGuard)
  @Delete(':id/image/:imageIndex')
  public async deleteCafeImage(
    @UserId() userId: string,
    @Param('id') id: string,
    @Param('imageIndex', ParseIntPipe) imageIndex: number,
  ) {
    await this.cafeService.deleteCafeImage({
      id,
      imageIndex,
      userId,
    });
    return {
      success: true,
    };
  }
}
