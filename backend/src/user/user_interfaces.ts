export interface User {
  email: string;
  password: string;
}

export interface MongoResponseUser extends User {
  _id: string;
  __v: number;
}