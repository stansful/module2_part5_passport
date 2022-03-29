import express from 'express';
import passport from 'passport';
import { NotFound } from './exception/http/not_found';
import { Controller } from './helpers/controller_interface';
import { config } from './config/config';
import { errorService } from './error/error_service';
import { mongoDatabase } from './database/mongo_database';
import { galleryService } from './gallery/gallery_service';
import { userService } from './user/user_service';
import { loggerService } from './logger/logger_service';
import { sleep } from './helpers/sleep';
import { PassportStrategies } from './auth/passport_strategies';

export class App {
  public app: express.Express;
  private readonly port: number;
  private readonly protocol: string;
  private readonly domain: string;
  private readonly retryTimeoutInSeconds: number;
  private retryAmount: number;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.port = config.env.PORT;
    this.protocol = config.env.PROTOCOL;
    this.domain = config.env.DOMAIN;

    this.retryTimeoutInSeconds = config.env.CONNECTION_RETRY_TIMEOUT_IN_SECONDS;
    this.retryAmount = config.env.CONNECTION_RETRY_AMOUNT;

    this.initializeMiddlewares();
    this.initializeStatic();
    this.initializeControllers(controllers);
    this.initializeErrorHandler();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(loggerService.logger);
    this.app.use(passport.initialize());
  }

  private initializeStatic() {
    this.app.use(express.static('static/pictures'), express.static('static/frontend'));
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => this.app.use('/', controller.router));

    this.app.all('*', () => {
      throw new NotFound('Path doest not exist');
    });
  }

  private initializeErrorHandler() {
    this.app.use(errorService.handleError);
  }

  private async connectToDB() {
    try {
      await mongoDatabase.connect();
      await loggerService.logger('Successfully connected to DB');
    } catch (error) {
      if (this.retryAmount > 0) {
        this.retryAmount -= 1;
        await sleep(this.retryTimeoutInSeconds);
        await this.connectToDB();
      } else {
        await loggerService.logger(`Connection to DB failed. ${error}`);
        await loggerService.logger(`Closing node...`);
        process.exit();
      }
    }
  }

  public onceBeforeStart = async () => {
    console.log('Creating upload & log folders');
    await loggerService.createLogFolderIfNotExist();
    await galleryService.createUploadFolderIfNotExist();

    console.log('Connecting to DB');
    await loggerService.logger('Attempt to connect to mongoDB...');
    await this.connectToDB();

    console.log('Parsing new images and uploading to DB');
    await loggerService.logger('Adding new images to DB...');
    await galleryService.parseAndUploadNewImagesToMongoDB();

    console.log('Adding dev users to DB');
    await loggerService.logger('Adding test users to DB...');
    await userService.addDevUsers();

    console.log('Initializing passport strategies');
    await loggerService.logger('Initializing passport strategies...');
    new PassportStrategies(passport).initializeStrategies();
  };

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server started on: ${this.protocol}://${this.domain}:${this.port}`);
    });
  }
}
