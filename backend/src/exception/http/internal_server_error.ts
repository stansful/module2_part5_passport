import { Exception } from '../exception';
import { config } from '../../config/config';

export class InternalServerError<Type> extends Exception<Type> {
  constructor(message: string, data?: Type) {
    super(config.httpStatusCodes.INTERNAL_SERVER_ERROR, message, data);
  }
}
