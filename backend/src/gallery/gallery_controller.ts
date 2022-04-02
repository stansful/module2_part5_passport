import express from 'express';
import multer from 'multer';
import passport from 'passport';
import { Controller } from '../helpers/controller_interface';
import { config } from '../config/config';
import { galleryService } from './gallery_service';

const upload = multer({ dest: config.static.path.uploads });

export class GalleryController implements Controller {
  public path: string;
  public router: express.Router;

  constructor() {
    this.path = '/gallery';
    this.router = express.Router();

    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router
      .route(this.path)
      .all(passport.authenticate('jwt', { failWithError: true }))
      .get(galleryService.getRequiredPictures)
      .post(upload.single('picture'), galleryService.createPicture);
  }
}
