import express from "express"
import morgan from "morgan"
import cors from "cors"
import router from "./routes/index.ts"

const app = express()

morgan.token("host", function (req, res) {
  return req.headers.host
})
app.use(
  morgan(":method :host :url :status :res[content-length] - :response-time ms"),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use("/api/v1", router)

app.use("*", (req, res) => {
  res.status(404).send("Service not found")
})

export default app
