import { getEnv } from "./config/config.ts"
import logger from "./config/logger.ts"
import mongoConn from "./drivers/mongo_conn.ts"
import app from "./server.ts"
import dotenv from "dotenv"

dotenv.config({ path: "../.env" })
const { PORT, ...mongoConfig } = getEnv()

const main = async () => {
  logger.info("Initializing server...")
  try {
    await mongoConn(mongoConfig)
    if (!PORT) {
      throw new Error("PORT is required")
    }

    const server = app.listen(PORT, () => {
      logger.info("Server running on port " + PORT)
    })

    const gracefulShutdown = () => {
      logger.info("Received kill signal, shutting down...")
      server.close(() => {
        logger.info("Server closed")
        process.exit(0)
      })
    }

    process.on("SIGINT", gracefulShutdown)
    process.on("SIGTERM", gracefulShutdown)
  } catch (error) {
    logger.error("Starting server: " + error)
    process.exit(1)
  }
}

main()
