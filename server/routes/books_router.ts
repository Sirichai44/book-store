import { Router } from "express"
import * as bookHandler from "../handlers/book_handler.ts"
import {
  validateGetBookById,
  validateGetBooks,
} from "./middleware/books_middleware.ts"

const booksRouter = Router()

booksRouter.get("/", validateGetBooks, (req, res) => {
  bookHandler.booksList(req, res)
})

booksRouter.get("/:id", validateGetBookById, (req, res) => {
  bookHandler.bookById(req, res)
})

export default booksRouter
