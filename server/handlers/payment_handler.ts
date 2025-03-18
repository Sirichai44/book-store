import type { Request, Response } from "express"

export const payment = async (req: Request, res: Response) => {
  return res.json({ message: "Payment successful" })
}
