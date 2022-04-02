import { Schema } from 'mongoose';

export interface User {
  email: string;
  password: string;
}

export interface MongoResponseUser extends User {
  _id: Schema.Types.ObjectId;
  __v: number;
}