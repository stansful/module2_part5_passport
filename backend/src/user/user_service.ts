import { User } from './user_interfaces';
import { userModel } from './user_model';
import { Crud } from '../helpers/crud_interface';
import { hashService } from '../hash/hash_service';

class UserService implements Crud<User> {
  public async getOne(email: string): Promise<User> {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('User does not exist');
    }
    return user;
  }

  public async getAll(): Promise<User[]> {
    return userModel.find({});
  }

  public create = async (candidate: User): Promise<User> => {
    try {
      await this.getOne(candidate.email);
    } catch (error) {
      const encryptedPassword = await hashService.hash(candidate.password);
      const user = await userModel.create({ ...candidate, password: encryptedPassword });
      return user.save();
    }
    throw new Error('User already exist');
  };

  public async delete(email: string): Promise<Boolean> {
    const user = await userModel.findOneAndDelete({ email });
    return Boolean(user);
  }

  public addDevUsers = async () => {
    const users = [
      { email: 'asergeev@flo.team', password: 'jgF5tn4F' },
      { email: 'vkotikov@flo.team', password: 'po3FGas8' },
      { email: 'tpupkin@flo.team', password: 'tpupkin@flo.team' },
    ];
    for await (const user of users) {
      try {
        await this.create(user);
      } catch (e) {
        console.log('user already added');
        continue;
      }
    }
  };
}

export const userService = new UserService();
