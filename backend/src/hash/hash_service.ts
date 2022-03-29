import { config } from '../config/config';
import bcrypt from 'bcrypt';
import { Unauthorized } from '../exception/http/unauthorized';

class HashService {
  private readonly salt: number;

  constructor() {
    this.salt = config.env.HASH_SALT;
  }

  public async hash(data: string | Buffer) {
    return bcrypt.hash(data, this.salt);
  }

  public async compare(data: string | Buffer, encryptedData: string) {
    const isValid = await bcrypt.compare(data, encryptedData);
    if(!isValid) {
      throw new Unauthorized('Invalid password');
    }
  }
}

export const hashService = new HashService();
