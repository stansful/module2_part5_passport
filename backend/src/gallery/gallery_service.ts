import { NextFunction, Request, Response } from 'express';
import { ExifParserFactory } from 'ts-exif-parser';
import path from 'path';
import { config } from '../config/config';
import { fsService } from '../fs/fs_service';
import { imageService } from '../image/image_service';
import { loggerService } from '../logger/logger_service';
import { BadRequest } from '../exception/http/bad_request';
import { PicturePaths } from './gallery_interfaces';
import { Image } from '../image/image_interface';
import { MongoResponseUser } from '../user/user_interfaces';

class GalleryService {
  private readonly limit: number;
  private readonly picturesPath: string;
  private readonly uploadsPath: string;

  constructor() {
    this.limit = config.env.DEFAULT_PICTURE_LIMIT;
    this.picturesPath = config.static.path.pictures;
    this.uploadsPath = config.static.path.uploads;
  }

  private async getAllPictures() {
    return fsService.readdir(this.picturesPath);
  }

  private checkIncomingFile(req: Request) {
    if (!req.file) {
      throw new BadRequest('File missing');
    }

    if (req.file.mimetype !== 'image/jpeg') {
      throw new BadRequest('Unfortunately we support only jpeg extension');
    }
  }

  private async getExifMetadata(path: string) {
    const buffer = await fsService.readFile(path);
    return ExifParserFactory.create(buffer).parse();
  }

  private checkRequestPage(requestPage: number) {
    if (requestPage < 1) {
      throw new BadRequest('Page does not exist');
    }
  }

  public async createUploadFolderIfNotExist() {
    try {
      await fsService.checkExistFolder(this.uploadsPath);
    } catch (e) {
      await fsService.makeDirectory(this.uploadsPath, { recursive: true });
    }
  }

  public getRequiredPictures = async (req: Request, res: Response, next: NextFunction) => {
    const requestPage = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || this.limit;
    const skip = requestPage * limit - limit;

    let filter: Object = {};
    const uploadedByUser = req.query.filter === 'true'
    if (uploadedByUser) {
      const user = <MongoResponseUser>req.user;
      filter = { belongsTo: user._id };
    }

    try {
      this.checkRequestPage(requestPage);
      const allImages = await imageService.getAll(filter, { skip, limit });
      res.json({ objects: allImages, page: requestPage });
    } catch (error) {
      await loggerService.logger(`Failed to send gallery objects. ${error}`);
      next(error);
    }
  };

  public createPicture = async (req: Request, res: Response, next: NextFunction) => {
    const picturePath = req.file?.path || '';
    const filename = req.file?.filename || '';
    const fileOriginalName = req.file?.originalname || '';
    const newFileName = filename + '_' + fileOriginalName;
    const newFilePath = path.join(this.picturesPath, newFileName);
    const user = <MongoResponseUser>req.user;

    try {
      this.checkIncomingFile(req);
      await fsService.moveFile(picturePath, newFilePath);

      const data = await this.getExifMetadata(newFilePath);

      const imageEntity: Image = { path: newFileName, metadata: data, belongsTo: user._id };
      await imageService.create(imageEntity);

      res.status(config.httpStatusCodes.CREATED).end();
    } catch (error) {
      await loggerService.logger(`Failed to upload picture to the server. ${error}`);
      next(error);
    }
  };

  public parseAndUploadNewImagesToMongoDB = async () => {
    const pictures = await this.getAllPictures();
    const picturesInfo = pictures.map((pictureName): PicturePaths => {
      return {
        fsRelativePath: pictureName,
        fsAbsolutePath: path.join(this.picturesPath, pictureName),
      };
    });

    for await (const pictureInfo of picturesInfo) {
      try {
        const data = await this.getExifMetadata(pictureInfo.fsAbsolutePath);
        const imageEntity: Image = { path: pictureInfo.fsRelativePath, metadata: data, belongsTo: null };
        await imageService.create(imageEntity);
      } catch (e) {
        console.log('Image already exist in mongoDB');
      }
    }
  };
}

export const galleryService = new GalleryService();
