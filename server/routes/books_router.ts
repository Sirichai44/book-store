import { Router, type Request } from "express"
import * as bookHandler from "../handlers/book_handler.ts"
import type { BooksListRequestBody } from "../types/book.ts"

const booksRouter = Router()

booksRouter.get("/", (req: Request<{}, {}, {}, BooksListRequestBody>, res) => {
  bookHandler.booksList(req, res)
})

booksRouter.get("/:id", (req, res) => {
  bookHandler.bookById(req, res)
})

export default booksRouter
