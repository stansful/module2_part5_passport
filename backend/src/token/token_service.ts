import { config } from '../config/config';
import jwt from 'jsonwebtoken';

class TokenService {
  private readonly secretToken: string;

  constructor() {
    this.secretToken = config.env.JWT_ACCESS_TOKEN;
  }

  public async sign(data: string | object | Buffer, options?: jwt.SignOptions) {
    return jwt.sign(data, this.secretToken, options);
  }
}

export const tokenService = new TokenService();
