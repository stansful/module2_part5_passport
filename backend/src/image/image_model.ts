import { Schema, model } from 'mongoose';
import { Image } from './image_interface';

const imageSchema = new Schema<Image>({
  path: { type: String, unique: true, required: true, lowercase: true },
  metadata: { type: Object, required: true },
  belongsTo: { type: Schema.Types.ObjectId || null, ref: 'User' },
});

export const imageModel = model<Image>('Image', imageSchema);
