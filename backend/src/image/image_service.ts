import { Crud } from '../helpers/crud_interface';
import { Image } from './image_interface';
import { imageModel } from './image_model';
import mongoose, { Schema } from 'mongoose';

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

  async getAll(options?: mongoose.QueryOptions): Promise<Image[]> {
    return imageModel.find({}, null, options);
  }

  async getOne(path: string): Promise<Image> {
    const image = await imageModel.findOne({ path });
    if (!image) {
      throw new Error('Image does not exist');
    }
    return image;
  }

  async getByUserId(id: Schema.Types.ObjectId, options?: mongoose.QueryOptions): Promise<Image[]> {
    return imageModel.find({ belongsTo: id }, null, options);
  }
}

export const imageService = new ImageService();
