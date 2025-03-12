export interface Env {
  PORT: Number
  MONGODB_URI: string
  MONGODB_USER: string
  MONGODB_PASSWORD: string
}

export interface MongoEnv extends Omit<Env, "PORT"> {}
