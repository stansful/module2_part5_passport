import { NextFunction, Request, Response } from 'express';
import { Exception } from '../exception/exception';
import { config } from '../config/config';
import { loggerService } from '../logger/logger_service';

class ErrorService {
  public async handleError(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof Exception) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
    await loggerService.logger(`Internal server error... ${error}`);
    res.status(config.httpStatusCodes.INTERNAL_SERVER_ERROR).json({ errorMessage: 'Oops...' });
  }
}

export const errorService = new ErrorService();
