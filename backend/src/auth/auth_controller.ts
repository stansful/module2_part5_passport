import express from 'express';
import { Controller } from '../helpers/controller_interface';
import { authService } from './auth_service';

export class AuthController implements Controller {
  public path: string;
  public router: express.Router;

  constructor() {
    this.path = '/login';
    this.router = express.Router();

    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, authService.signIn);
  }
}
