import * as booksHandler from "../handlers/book_handler.ts"
import BooksSchema from "../models/books.ts"
import type { BooksListRequestBody } from "../types/book.ts"
import type { Request, Response } from "express"

const mockAggregate = (BooksSchema.aggregate = jest.fn())
const mockFindByID = (BooksSchema.findById = jest.fn())

describe("Book Handler", () => {
  describe("booksList", () => {
    it("should return books", async () => {
      const mockBooks = Array.from({ length: 10 }, (_, i) => {
        return new BooksSchema({
          title: `Book ${i + 1}`,
          author: `Author ${i + 1}`,
          rating: 4.8,
          price: 29.99,
          image: `image ${i + 1}`,
          stock: 10,
        })
      })

      const mockReq = {
        query: {
          page: "1",
          limit: "10",
          search: "",
        },
        headers: {
          host: "localhost",
        },
      } as Request<{}, {}, {}, BooksListRequestBody>

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response

      mockAggregate.mockResolvedValue([
        { data: mockBooks, total: [{ count: mockBooks.length }] },
      ])

      await booksHandler.booksList(mockReq, mockResponse)

      expect(BooksSchema.aggregate).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockBooks,
        total: mockBooks.length,
      })
    })

    it("should return 500 if an error occurs", async () => {
      const mockReq = {
        query: {
          page: "1",
          limit: "10",
          search: "",
        },
      } as Request<{}, {}, {}, BooksListRequestBody>

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response

      mockAggregate.mockRejectedValue(new Error("An error occurred"))

      await booksHandler.booksList(mockReq, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "An error occurred",
      })
    })
  })

  describe("bookById", () => {
    it("should return a book by id", async () => {
      const id = "60f7b3b3d9f4f3b3b3b3b3b3"
      const mockBook = new BooksSchema({
        _id: id,
        title: `Book Title 1`,
        author: `Author 1`,
        pageCount: 300,
        description: `Description 1`,
        publishDate: new Date(`2025-03-15T00:00:00Z`),
        genres: [`Genre 1`],
        format: "Hardcover",
        isbn: `978-1-234567-89-1`,
        language: "English",
        price: 29.99,
        publisher: "Future Press",
        rating: 4.8,
      })

      const mockReq = {
        params: {
          id: id,
        },
        headers: {
          host: "localhost",
        },
      } as Request<{ id: string }>

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response

      mockFindByID.mockResolvedValue(mockBook)

      await booksHandler.bookById(mockReq, mockResponse)

      expect(BooksSchema.findById).toHaveBeenCalledWith(id)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook)
    })

    it("should return 404 if book is not found", async () => {
      const id = "60f7b3b3d9f4f3b3b3b3b3b3"
      const mockReq = {
        params: {
          id: id,
        },
        headers: {
          host: "localhost",
        },
      } as Request<{ id: string }>

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response

      mockFindByID.mockResolvedValue(null)

      await booksHandler.bookById(mockReq, mockResponse)

      expect(BooksSchema.findById).toHaveBeenCalledWith(id)
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Book not found",
      })
    })

    it("should return 500 if an error occurs", async () => {
      const id = "60f7b3b3d9f4f3b3b3b3b3b3"
      const mockReq = {
        params: {
          id: id,
        },
        headers: {
          host: "localhost",
        },
      } as Request<{ id: string }>

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response

      mockFindByID.mockRejectedValue(new Error("An error occurred"))

      await booksHandler.bookById(mockReq, mockResponse)

      expect(BooksSchema.findById).toHaveBeenCalledWith(id)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "An error occurred",
      })
    })
  })
})
