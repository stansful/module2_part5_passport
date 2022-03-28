import { Exception } from '../exception';
import { config } from '../../config/config';

export class NotFound<Type> extends Exception<Type> {
  constructor(message: string, data?: Type) {
    super(config.httpStatusCodes.NOT_FOUND, message, data);
  }
}
