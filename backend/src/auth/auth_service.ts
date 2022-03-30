import { Request, Response } from 'express';
import { config } from '../config/config';
import { tokenService } from '../token/token_service';
import { userService } from '../user/user_service';
import { MongoResponseUser, User } from '../user/user_interfaces';

class AuthService {
  public signIn = async (req: Request, res: Response) => {
    const user = <MongoResponseUser>req.user;
    const token = await tokenService.sign(user.email);
    res.json({ token });
  };

  public signUp = async (req: Request, res: Response) => {
    const candidate: User = { email: req.body.email, password: req.body.password };
    try {
      await userService.create(candidate);
      const message = { message: 'Created' };
      res.status(config.httpStatusCodes.CREATED).json(message);
    } catch (e) {
      const unAuthorizedMessage = { errorMessage: 'Email already exist' };
      res.status(config.httpStatusCodes.BAD_REQUEST).json(unAuthorizedMessage);
    }
  };
}

export const authService = new AuthService();
