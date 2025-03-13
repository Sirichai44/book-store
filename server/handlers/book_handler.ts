import type { Request, Response } from "express"
import * as bookService from "../services/books_service.ts"
import logger from "../config/logger.ts"
import type { BooksListRequestBody } from "../types/book.ts"
import { validObjectID } from "../config/config.ts"

export const booksList = async (
  req: Request<{}, {}, BooksListRequestBody>,
  res: Response,
) => {
  const { page, limit } = req.body

  if (!page || !limit) {
    return res.status(400).json({ message: "Page and limit are required" })
  }

  try {
    const books = await bookService.getBooks(page, limit)
    logger.info(
      `Books handler: ${req.headers.host} Get all books successful with ${books.length} books`,
    )
    return res.status(200).json(books)
  } catch (error) {
    logger.error("Books handler: " + error)
    return res.status(500).json({ message: "An error occurred" })
  }
}

export const bookById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params

  if (!validObjectID(id)) {
    logger.error(`Books handler: ${req.headers.host} Invalid id`)
    return res.status(400).json({ message: "Invalid id" })
  }

  try {
    const book = await bookService.getBookById(id)
    if (!book) {
      logger.error(`Books handler: ${req.headers.host} Book not found`)
      return res.status(404).json({ message: "Book not found" })
    }
    logger.info(
      `Books handler: ${req.headers.host} Get book by id successful with ${book.title}`,
    )
    return res.status(200).json(book)
  } catch (error) {
    logger.error("Books handler: " + error)
    return res.status(500).json({ message: "An error occurred" })
  }
}
