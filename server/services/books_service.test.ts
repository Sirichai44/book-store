import { describe, expect, it, jest } from "bun:test"
import * as booksService from "../services/books_service.ts"
import BooksSchema from "../models/books.ts"

const mockSkip = jest.fn().mockReturnThis()
const mockLimit = jest.fn().mockResolvedValue([])
BooksSchema.find = jest.fn().mockReturnValue({
  skip: mockSkip,
  limit: mockLimit,
})

const mockFindByID = (BooksSchema.findById = jest.fn())

describe("Book Service", () => {
  describe("getBooks", () => {
    it("should return books", async () => {
      const mockBooks = Array.from({ length: 10 }, (_, i) => {
        return new BooksSchema({
          title: `Book ${i + 1}`,
          author: `Author ${i + 1}`,
          pageCount: 300 + i,
          description: `Description ${i + 1}`,
          publishDate: new Date(`2025-03-15T00:00:00Z`),
          genres: [`Genre ${i + 1}`, `Genre ${i + 2}`],
          format: "Hardcover",
          isbn: `978-1-234567-89-${i}`,
          language: "English",
          price: 29.99,
          publisher: "Future Press",
          rating: 4.8,
        })
      })

      mockLimit.mockResolvedValue(mockBooks)

      const result = await booksService.getBooks(1, 10)

      expect(result).toEqual(mockBooks)
      expect(BooksSchema.find).toHaveBeenCalledTimes(1)
      expect(mockSkip).toHaveBeenCalledWith(0)
      expect(mockLimit).toHaveBeenCalledWith(10)
    })
  })

  describe("getBookById", () => {
    it("should return a book by id", async () => {
      const mockBook = new BooksSchema({
        title: `Book 1`,
        author: `Author 1`,
        pageCount: 300,
        description: `Description `,
        publishDate: new Date(`2025-03-15T00:00:00Z`),
        genres: [`Genre`],
        format: "Hardcover",
        isbn: `978-1-234567-89-1`,
        language: "English",
        price: 29.99,
        publisher: "Future Press",
        rating: 4.8,
      })

      mockFindByID.mockResolvedValue(mockBook)

      const result = await booksService.getBookById("1")
      expect(result).toEqual(mockBook)
      expect(BooksSchema.findById).toHaveBeenCalledWith("1")
    })
  })
})
