import { getEnv } from "./config/config.ts"
import mongoConn from "./drivers/mongo_conn.ts"
import app from "./server.ts"
import dotenv from "dotenv"

dotenv.config({ path: "../.env" })
const { PORT, ...mongoConfig } = getEnv()

const main = async () => {
  try {
    await mongoConn(mongoConfig)
    if (!PORT) {
      throw new Error("PORT is required")
    }

    const server = app.listen(PORT, () => {
      console.log("Server running on port %d", PORT)
    })

    const gracefulShutdown = () => {
      console.log("Received kill signal, shutting down...")
      server.close(() => {
        console.log("Server is closed")
        process.exit(0)
      })
    }

    process.on("SIGINT", gracefulShutdown)
    process.on("SIGTERM", gracefulShutdown)
  } catch (error) {
    console.error("Error starting server: %s", error)
    process.exit(1)
  }
}

main()
