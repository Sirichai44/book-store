import { beforeEach, describe, expect, it, jest } from "bun:test"
import type { NextFunction, Request, Response } from "express"
import { validateGetBookById, validateGetBooks } from "./books_middleware"
import type { BooksListRequestBody } from "../../types/book"

describe("Books Middleware", () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  describe("Validate Get Books", () => {
    it("should call next if request is valid", () => {
      req.query = { page: "1", limit: "10" }

      validateGetBooks(
        req as unknown as Request<{}, {}, {}, BooksListRequestBody>,
        res as Response,
        next,
      )

      expect(next).toHaveBeenCalled()
    })

    it("should return 400 if page and limit are not numbers", () => {
      req.query = { page: "a", limit: "b" }

      validateGetBooks(
        req as unknown as Request<{}, {}, {}, BooksListRequestBody>,
        res as Response,
        next,
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "Page and limit must be numbers",
      })
    })

    it("should return 400 if page or limit is missing", () => {
      req.query = { page: "1" }

      validateGetBooks(
        req as unknown as Request<{}, {}, {}, BooksListRequestBody>,
        res as Response,
        next,
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "query limit is Required",
      })
    })
  })

  describe("Validate Get Book By Id", () => {
    it("should call next if request is valid", () => {
      req.params = { id: "1a1a1a1a1a1a1a1a1a1a1a1a" }

      validateGetBookById(req as Request<{ id: string }>, res as Response, next)

      expect(next).toHaveBeenCalled()
    })

    it("should return 400 if id is missing", () => {
      req.params = {}

      validateGetBookById(req as Request<{ id: string }>, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: "id is required" })
    })

    it("should return 400 if id is invalid", () => {
      req.params = { id: "invalid" }

      validateGetBookById(req as Request<{ id: string }>, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid id" })
    })
  })
})
