import { DynamicModule, HttpException } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModule, MulterModuleAsyncOptions } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { randomUUID } from "crypto";
import { Request } from "express";
import { diskStorage } from "multer";
import { extname } from "path";

export default function getImageUploadModule(): DynamicModule {
    const imageUploadModule = MulterModule.registerAsync(imageUploadOptions);
    return imageUploadModule;
}

const imageUploadOptions: MulterModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        const destinationPath = configService.get('IMAGE_PATH');
        return getImageUploadMulterOptions(destinationPath);
    },
    inject: [ConfigService],
}

function getImageUploadMulterOptions(destinationPath: string): MulterOptions {
    return {
        fileFilter: imageFileFilter,
        storage: getImageStorage(destinationPath),
    }
} 

function imageFileFilter(
    _: Request, 
    { mimetype, originalname }, 
    cb: (error: Error | null, acceptFile: boolean) => void
) {
    if (isImage(mimetype)) {
        cb(null, true);
    } else {
        cb(new HttpException(`Unsupported file type ${extname(originalname)}`, 400), false);
    }
}

function getImageStorage(destinationPath: string) { 
    const imageStorage = diskStorage({
        destination: (_, __, cb) => cb(null, destinationPath),
        filename: (_, { originalname }, cb) => cb(null, randomImageName(originalname)),
    });
    return imageStorage;
}

function isImage(mimetype: string): boolean {
    const matchedMimetypeString = mimetype.match(/\/(jpg|jpeg|png|gif)$/);
    const isMatched = matchedMimetypeString.length > 0;
    return isMatched;
}

function randomImageName(originalImageName: string) {
    const randomName = randomUUID();
    const extension = extname(originalImageName);
    const imageName = `${randomName}${extension}`;
    return imageName;
}
