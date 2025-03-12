import express from "express"
import morgan from "morgan"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("common"))

app.get("/", (req, res) => {
  res.status(200).send("Hello World")
})

export default app
