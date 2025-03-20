import type { ProcessPayment } from "../../types/payment"
import type { NextFunction, Request, Response } from "express"
import { validateProcessPayment } from "./payment_middleware"

describe("Payment Middleware", () => {
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

  describe("Validate Process Payment", () => {
    it("should call next if request is valid", () => {
      req.body = {
        amount: 100,
        currency: "USD",
        items: [{ _id: "1", name: "Book", quantity: 1, price: 100 }],
        card: { number: "1234567890123456", expiry: "01/25", cvv: "123" },
      }

      validateProcessPayment(
        req as unknown as Request<{}, {}, ProcessPayment>,
        res as Response,
        next,
      )

      expect(next).toHaveBeenCalled()
    })

    it("should return 400 if request is invalid with missing field", () => {
      req.body = {
        amount: 100,
        currency: "USD",
        items: [{ _id: "1", name: "Book", quantity: 1, price: 100 }],
        card: { number: "1234567890123456", expiry: "01/25" },
      }

      validateProcessPayment(
        req as unknown as Request<{}, {}, ProcessPayment>,
        res as Response,
        next,
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "body card cvv is Required",
      })
    })

    it("should return 400 if request is invalid with invalid field", () => {
      req.body = {
        amount: 100,
        currency: "USD",
        items: [{ _id: "1", name: "Book", quantity: 1, price: 100 }],
        card: { number: "1234567890123456", expiry: "01/25", cvv: "12a" },
      }

      validateProcessPayment(
        req as unknown as Request<{}, {}, ProcessPayment>,
        res as Response,
        next,
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "body card cvv is Invalid",
      })
    })
  })
})
