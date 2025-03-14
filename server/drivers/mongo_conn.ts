import mongoose from "mongoose"
import type { MongoEnv } from "../types/config"
import logger from "../config/logger.ts"

const mongoConn = async (config: MongoEnv) => {
  logger.info("Connecting to MongoDB...")
  try {
    await mongoose.connect(config.MONGODB_URI, {
      dbName: config.MONGODB_DATABASE,
      serverSelectionTimeoutMS: 10000,
    })
    logger.info("Connected to MongoDB")
  } catch (error) {
    logger.error("Connecting to MongoDB")
    throw error
  }
}

export default mongoConn
