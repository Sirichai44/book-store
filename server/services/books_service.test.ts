import * as booksService from "../services/books_service.ts"
import BooksSchema from "../models/books.ts"
import type { ItemPayment } from "../types/payment.ts"
import type { StockBook } from "../types/book.ts"

let mockAggregate: jest.SpyInstance
let mockFindByID: jest.SpyInstance
let mockBulkWrite: jest.SpyInstance

describe("Book Service", () => {
  beforeEach(() => {
    mockAggregate = jest.spyOn(BooksSchema, "aggregate")
    mockFindByID = jest.spyOn(BooksSchema, "findById")
    mockBulkWrite = jest.spyOn(BooksSchema, "bulkWrite")
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe("Get Books", () => {
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

  describe("Get Book By ID", () => {
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

  describe("Find and Update Stock", () => {
    it("should update the stock of books", async () => {
      const updates: ItemPayment[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a1a",
          name: "Book 1",
          quantity: 1,
          price: 29.99,
        },
        {
          _id: "2b2b2b2b2b2b2b2b2b2b2b2b",
          name: "Book 2",
          quantity: 2,
          price: 39.99,
        },
      ]

      const bulkOps = updates.map((update) => ({
        updateOne: {
          filter: { _id: update._id },
          update: { $inc: { stock: -update.quantity } },
        },
      }))

      mockBulkWrite.mockResolvedValue({} as any)

      await booksService.findAndUpdateStock(updates)

      expect(mockBulkWrite).toHaveBeenCalledTimes(1)
      expect(mockBulkWrite).toHaveBeenCalledWith(bulkOps)
    })
  })

  describe("Get Stock", () => {
    it("should return the stock of books", async () => {
      const items: ItemPayment[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a1a",
          name: "Book 1",
          quantity: 1,
          price: 29.99,
        },
        {
          _id: "2b2b2b2b2b2b2b2b2b2b2b2b",
          name: "Book 2",
          quantity: 2,
          price: 39.99,
        },
      ]

      const mockBooks: StockBook[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a1a",
          stock: 10,
          price: 29.99,
          insufficientStock: false,
        },
        {
          _id: "2b2b2b2b2b2b2b2b2b2b2b2b",
          stock: 5,
          price: 39.99,
          insufficientStock: false,
        },
      ]

      mockAggregate.mockResolvedValue(mockBooks)

      const result = await booksService.getStock(items)

      expect(mockAggregate).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockBooks)
    })
  })

  describe("Check Insufficient Stock", () => {
    it("should throw an error if stock is insufficient", () => {
      const books: StockBook[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a1a",
          stock: 10,
          price: 29.99,
          insufficientStock: false,
        },
        {
          _id: "2b2b2b2b2b2b2b2b2b2b2b2b",
          stock: 10,
          price: 39.99,
          insufficientStock: true,
        },
      ]

      const result = () => booksService.checkInsufficientStock(books)
      expect(result).toThrowError(
        "Book Service: Out of stock books id: 2b2b2b2b2b2b2b2b2b2b2b2b",
      )
    })
  })

  describe("Check Price", () => {
    it("should throw an error if price is incorrect", () => {
      const items: ItemPayment[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a1a",
          name: "Book 1",
          quantity: 1,
          price: 10.0,
        },
        {
          _id: "2b2b2b2b2b2b2b2b2b2b2b",
          name: "Book 2",
          quantity: 2,
          price: 20.0,
        },
      ]

      const books: StockBook[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a1a",
          stock: 10,
          price: 10.0,
          insufficientStock: false,
        },
        {
          _id: "2b2b2b2b2b2b2b2b2b2b2b",
          stock: 10,
          price: 20.0,
          insufficientStock: false,
        },
      ]

      const amount = 40.0

      const result = () => booksService.checkPrice(items, books, amount)
      expect(result).toThrowError(
        "Book Service: Total price mismatch, store price 50 but request price 40",
      )
    })
  })
})
