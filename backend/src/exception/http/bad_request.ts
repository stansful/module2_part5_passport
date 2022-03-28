import { Exception } from '../exception';
import { config } from '../../config/config';

export class BadRequest<Type> extends Exception<Type> {
  constructor(message: string, data?: Type) {
    super(config.httpStatusCodes.BAD_REQUEST, message, data);
  }
}
