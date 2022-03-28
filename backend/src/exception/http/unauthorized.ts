import { Exception } from '../exception';
import { config } from '../../config/config';

export class Unauthorized<Type> extends Exception<Type> {
  constructor(message: string, data?: Type) {
    super(config.httpStatusCodes.UNAUTHORIZED, message, data);
  }
}
