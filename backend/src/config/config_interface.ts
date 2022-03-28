interface Path {
  pictures: string;
  logs: string;
  uploads: string;
}

interface Env {
  PORT: number;
  PROTOCOL: string;
  DOMAIN: string;
  DEFAULT_PICTURE_LIMIT: number;
  JWT_ACCESS_TOKEN: string;
  LOG_INTERVAL_IN_MINUTES: number;
  MONGO_USER: string;
  MONGO_PASSWORD: string;
  MONGO_CLUSTER: string;
  MONGO_DB_NAME: string;
  CONNECTION_RETRY_AMOUNT: number;
  CONNECTION_RETRY_TIMEOUT_IN_SECONDS: number;
  HASH_SALT: number;
}

interface HttpStatusCodes {
  OK: number;
  CREATED: number;
  BAD_REQUEST: number;
  UNAUTHORIZED: number;
  NOT_FOUND: number;
  INTERNAL_SERVER_ERROR: number;
}

export interface Config {
  env: Env;
  httpStatusCodes: HttpStatusCodes;
  static: {
    path: Path;
  };
}
