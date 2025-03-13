import { Router } from "express"
import booksRouter from "./books_router.ts"

const router = Router()

router.get("/", (req, res) => {
  res.status(200).send("Hello World")
})

router.use("/books", booksRouter)

export default router
