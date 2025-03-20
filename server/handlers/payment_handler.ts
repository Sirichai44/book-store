import type { Request, Response } from "express"
import type { ProcessPayment } from "../types/payment"
import * as bookService from "../services/books_service.ts"
import * as paymentService from "../services/payment_service.ts"
import logger from "../config/logger.ts"

export const processPayment = async (
  req: Request<{}, {}, ProcessPayment>,
  res: Response,
) => {
  const { amount, items, card, currency } = req.body

  try {
    const books = await bookService.getStock(items)

    await bookService.checkInsufficientStock(books)
    logger.info("Payment handler: Stock is sufficient for all items")

    await bookService.checkPrice(items, books, amount)
    logger.info("Payment handler: Price is correct for all items")

    const paymentRes = await paymentService.payment({ amount, card, currency })
    logger.info(
      "Payment handler: Payment service success with transaction id: ",
      paymentRes.transactionId,
    )

    await bookService.findAndUpdateStock(items)
    logger.info(
      "Payment handler: Stock updated for ids: ",
      items.map((item) => item._id).join(", "),
    )

    logger.info("Payment handler: Payment successful")
    return res.status(200).json({
      message: "Payment successful",
      transactionId: paymentRes.transactionId,
    })
  } catch (error) {
    logger.error("Payment handler: ", error)
    return res.status(500).json({ message: "Error processing payment" })
  }
}
