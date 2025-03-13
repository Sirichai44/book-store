import { Router } from "express"
import * as bookHandler from "../handlers/book_handler.ts"

const booksRouter = Router()

booksRouter.post("/", (req, res) => {
  bookHandler.booksList(req, res)
})

booksRouter.get("/:id", (req, res) => {
  bookHandler.bookById(req, res)
})

export default booksRouter
