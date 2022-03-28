import mongoose from 'mongoose';
import { Database } from './database_interface';
import { config } from '../config/config';

class MongoDatabase implements Database {
  private readonly mongoUrl: string;

  constructor() {
    const {
      env: { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DB_NAME },
    } = config;
    this.mongoUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;
  }

  public connect = async (url = this.mongoUrl) => {
    try {
      await mongoose.connect(url, { connectTimeoutMS: 1000 });
    } catch (error) {
      throw new Error(`Cannot connect to mongo db. ${error}`);
    }
  };
}

export const mongoDatabase = new MongoDatabase();
