import { Crud } from '../helpers/crud_interface';
import { Image } from './image_interface';
import { imageModel } from './image_model';
import mongoose from 'mongoose';

class ImageService implements Crud<Image> {
  create = async (entity: Image): Promise<Image> => {
    try {
      await this.getOne(entity.path);
    } catch (e) {
      const image = await imageModel.create({ ...entity });
      return image.save();
    }
    throw new Error('Image already exist');
  };

  async delete(path: string): Promise<Boolean> {
    const image = await imageModel.findOneAndDelete({ path });
    return Boolean(image);
  }

  async getAll(filter: mongoose.FilterQuery<Image>, options?: mongoose.QueryOptions): Promise<Image[]> {
    return imageModel.find(filter, null, options);
  }

  async getOne(path: string): Promise<Image> {
    const image = await imageModel.findOne({ path });
    if (!image) {
      throw new Error('Image does not exist');
    }
    return image;
  }
}

export const imageService = new ImageService();
