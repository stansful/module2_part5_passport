import { config } from '../config/config';
import bcrypt from 'bcrypt';

class HashService {
  private readonly salt: number;

  constructor() {
    this.salt = config.env.HASH_SALT;
  }

  public async hash(data: string | Buffer) {
    return bcrypt.hash(data, this.salt);
  }

  public async compare(data: string | Buffer, encryptedData: string) {
    return bcrypt.compare(data, encryptedData);
  }
}

export const hashService = new HashService();
