import { Schema } from 'mongoose';

export interface Image {
  path: string;
  metadata: Object;
  belongsTo: Schema.Types.ObjectId | null;
}

export interface ImageOptions {
  skip: number;
  limit: number;
}
