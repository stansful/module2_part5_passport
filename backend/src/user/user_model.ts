import { Schema, model } from 'mongoose';
import { User } from './user_interface';

const userSchema = new Schema<User>({
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
});

export const userModel = model<User>('User', userSchema);
