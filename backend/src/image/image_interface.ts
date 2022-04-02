import { Schema } from 'mongoose';

export interface Image {
  path: string;
  metadata: Object;
  belongsTo: Schema.Types.ObjectId | null;
}
