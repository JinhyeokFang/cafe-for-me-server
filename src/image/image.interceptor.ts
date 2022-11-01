import { NestInterceptor, Type } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

const ImageInterceptor: Type<NestInterceptor> = FilesInterceptor('images');

export default ImageInterceptor;
