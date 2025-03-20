import * as bookService from "../services/books_service.ts"
import * as paymentService from "../services/payment_service.ts"
import type { Request, Response } from "express"
import type { ProcessPayment } from "../types/payment.ts"
import type { StockBook } from "../types/book.ts"
import { processPayment } from "./payment_handler.ts"

describe("Payment Handler", () => {
  let req: Partial<Request>
  let res: Partial<Response>

  let mockGetStock: jest.SpyInstance
  let mockPayment: jest.SpyInstance
  let mockFindAndUpdateStock: jest.SpyInstance

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    mockGetStock = jest.spyOn(bookService, "getStock")
    mockPayment = jest.spyOn(paymentService, "payment")
    mockFindAndUpdateStock = jest.spyOn(bookService, "findAndUpdateStock")
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe("Process Payment", () => {
    it("should process payment successfully", async () => {
      req.body = {
        amount: 100,
        currency: "USD",
        items: [
          {
            _id: "1a1a1a1a1a1a1a1a1a1a1a1a",
            name: "Book",
            quantity: 1,
            price: 100,
          },
        ],
        card: { number: "1234567890123456", expiry: "01/25", cvv: "123" },
      } as unknown as Request<{}, {}, ProcessPayment>

      const mockBooksStock: StockBook[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a1a",
          stock: 10,
          price: 100,
          insufficientStock: false,
        },
      ]

      const mockResPayment = {
        data: {
          status: "success",
          message: "Payment successful",
          transactionId: "1234567890",
        },
      }

      mockGetStock.mockReturnValue(Promise.resolve(mockBooksStock))
      mockPayment.mockReturnValue(Promise.resolve(mockResPayment))
      mockFindAndUpdateStock.mockReturnValue(Promise.resolve())

      await processPayment(
        req as Request<{}, {}, ProcessPayment>,
        res as Response,
      )

      expect(mockGetStock).toHaveBeenCalledTimes(1)
      expect(mockPayment).toHaveBeenCalledTimes(1)
      expect(mockFindAndUpdateStock).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it("should Insufficient Stock Error", async () => {
      req.body = {
        amount: 100,
        currency: "USD",
        items: [
          {
            _id: "1a1a1a1a1a1a1a1a1a1a1a",
            name: "Book",
            quantity: 1,
            price: 100,
          },
        ],
        card: { number: "1234567890123456", expiry: "01/25", cvv: "123" },
      } as unknown as Request<{}, {}, ProcessPayment>

      const mockBooksStock: StockBook[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a",
          stock: 0,
          price: 100,
          insufficientStock: true,
        },
      ]

      mockGetStock.mockReturnValue(Promise.resolve(mockBooksStock))

      await processPayment(
        req as Request<{}, {}, ProcessPayment>,
        res as Response,
      )

      expect(mockGetStock).toHaveBeenCalledTimes(1)
      expect(mockPayment).not.toHaveBeenCalled()
      expect(mockFindAndUpdateStock).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
    })

    it("should Price Mismatch Error", async () => {
      req.body = {
        amount: 100,
        currency: "USD",
        items: [
          {
            _id: "1a1a1a1a1a1a1a1a1a1a1a",
            name: "Book",
            quantity: 1,
            price: 100,
          },
        ],
        card: { number: "1234567890123456", expiry: "01/25", cvv: "123" },
      } as unknown as Request<{}, {}, ProcessPayment>

      const mockBooksStock: StockBook[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a",
          stock: 10,
          price: 200,
          insufficientStock: false,
        },
      ]

      mockGetStock.mockReturnValue(Promise.resolve(mockBooksStock))

      await processPayment(
        req as Request<{}, {}, ProcessPayment>,
        res as Response,
      )

      expect(mockGetStock).toHaveBeenCalledTimes(1)
      expect(mockPayment).not.toHaveBeenCalled()
      expect(mockFindAndUpdateStock).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
    })

    it("should Payment Service Error", async () => {
      req.body = {
        amount: 100,
        currency: "USD",
        items: [
          {
            _id: "1a1a1a1a1a1a1a1a1a1a1a",
            name: "Book",
            quantity: 1,
            price: 100,
          },
        ],
        card: { number: "1234567890123456", expiry: "01/25", cvv: "123" },
      } as unknown as Request<{}, {}, ProcessPayment>

      const mockBooksStock: StockBook[] = [
        {
          _id: "1a1a1a1a1a1a1a1a1a1a1a",
          stock: 10,
          price: 100,
          insufficientStock: false,
        },
      ]

      mockGetStock.mockReturnValue(Promise.resolve(mockBooksStock))
      mockPayment.mockRejectedValue(new Error("Payment Service Error"))

      await processPayment(
        req as Request<{}, {}, ProcessPayment>,
        res as Response,
      )

      expect(mockGetStock).toHaveBeenCalledTimes(1)
      expect(mockPayment).toHaveBeenCalledTimes(1)
      expect(mockFindAndUpdateStock).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})
