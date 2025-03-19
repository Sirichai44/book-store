import type { NextFunction, Request, Response } from "express"
import { z } from "zod"
import type { BooksListRequestBody } from "../../types/book"
import logger from "../../config/logger.ts"
import { validObjectID } from "../../config/config.ts"

const getbooksSchema = z.object({
  query: z.object({
    page: z.string(),
    limit: z.string(),
    search: z.string().optional(),
  }),
})

export const validateGetBooks = (
  req: Request<{}, {}, {}, BooksListRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { error } = getbooksSchema.safeParse(req)
  if (error) {
    const message = error.errors
      .map((err) => `${err.path.join(" ")} is ${err.message}`)
      .join(", ")
    logger.error(`Middleware: ${message}`)
    res.status(400).json({ message })
    return
  }

  const { page, limit } = req.query
  const p = isNaN(Number(page))
  const l = isNaN(Number(limit))

  if (p || l) {
    logger.error("Middleware: Page and limit must be numbers")
    res.status(400).json({ message: "Page and limit must be numbers" })
    return
  }

  next()
}

export const validateGetBookById = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params
  if (!id) {
    logger.error("Middleware: id is required")
    res.status(400).json({ message: "id is required" })
    return
  }

  if (!validObjectID(id)) {
    logger.error("Middleware: Invalid id")
    res.status(400).json({ message: "Invalid id" })
    return
  }

  next()
}
