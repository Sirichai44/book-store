import type { NextFunction, Request, Response } from "express"
import { z } from "zod"
import type { ProcessPayment } from "../../types/payment"
import logger from "../../config/logger.ts"

const paymentSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string(),
    items: z.array(
      z.object({
        _id: z.string(),
        name: z.string(),
        quantity: z.number().positive(),
        price: z.number().positive(),
      }),
    ),
    card: z.object({
      number: z.string().length(16),
      expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
      cvv: z.string().regex(/^\d{3}$/),
    }),
  }),
})

export const validateProcessPayment = (
  req: Request<{}, {}, ProcessPayment>,
  res: Response,
  next: NextFunction,
) => {
  const { error } = paymentSchema.safeParse(req)
  if (error) {
    const message = error.errors
      .map((err) => `${err.path.join(" ")} is ${err.message}`)
      .join(", ")
    logger.error(`Middleware: ${message}`)
    res.status(400).json({ message })
    return
  }

  next()
}
