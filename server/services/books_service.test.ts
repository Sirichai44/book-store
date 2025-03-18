import { beforeEach, describe, expect, it, jest } from "bun:test"
import * as booksService from "../services/books_service.ts"
import BooksSchema from "../models/books.ts"

const mockAggregate = (BooksSchema.aggregate = jest.fn())

const mockFindByID = (BooksSchema.findById = jest.fn())

describe("Book Service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getBooks", () => {
    it("should return books without search", async () => {
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
      mockAggregate.mockResolvedValue([
        { data: mockBooks, total: [{ count: mockBooks.length }] },
      ])

      const result = await booksService.getBooks(1, 10, "")

      expect(BooksSchema.aggregate).toHaveBeenCalledTimes(1)
      expect(result.data).toEqual(mockBooks)
      expect(result.total).toEqual(mockBooks.length)
    })

    it("should return books with search", async () => {
      const mockBooks = Array.from({ length: 10 }, (_, i) => {
        return new BooksSchema({
          title: `Book ${i + 1}`,
          author: `Author ${i + 1}`,
          pageCount: 300 + i,
          description: `Description Test ${i + 1}`,
          publishDate: new Date(`2025-03-15T00:00:00Z`),
          genres: [`Genre ${i + 1}`, `Genre ${i + 2}`],
          format: "Hardcover",
          isbn: `978-1-234567-89-${i}`,
          language: "English",
          price: 29.99,
          publisher: "Future Press",
          rating: 4.8,
          image: `image ${i + 1}`,
          stock: 10,
        })
      })
      mockAggregate.mockResolvedValue([
        { data: mockBooks, total: [{ count: mockBooks.length }] },
      ])

      const result = await booksService.getBooks(1, 10, "Test")

      expect(BooksSchema.aggregate).toHaveBeenCalledTimes(1)
      expect(result.data).toEqual(mockBooks)
      expect(result.total).toEqual(mockBooks.length)
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
