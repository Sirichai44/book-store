import { Router } from "express"
import * as paymentHandler from "../handlers/payment_handler.ts"
import { validateProcessPayment } from "./middleware/payment_middleware.ts"

const paymentRouter = Router()

paymentRouter.post("/", validateProcessPayment, (req, res) => {
  paymentHandler.processPayment(req, res)
})

export default paymentRouter
