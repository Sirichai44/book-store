import mongoose from "mongoose"
import type { Env, MongoEnv } from "../types/config"

// const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017"
// const MONGO_USER = process.env.MONGO_USER || "root"
// const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "P@ssw0rd"

const mongoConn = async (config: MongoEnv) => {
  try {
    console.log("Connecting to MongoDB...")

    await mongoose.connect(config.MONGODB_URI, {
      auth: {
        username: config.MONGODB_USER,
        password: config.MONGODB_PASSWORD,
      },
      serverSelectionTimeoutMS: 10000,
    })
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("Error connecting to MongoDB")
    throw error
  }
}

export default mongoConn
