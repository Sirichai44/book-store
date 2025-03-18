import { Router, type Request } from "express"
import * as paymentHandler from "../handlers/payment_handler.ts"

const paymentRouter = Router()

paymentRouter.post("/", (req: Request<{}, {}, {}>, res) => {
  paymentHandler.payment(req, res)
})

export default paymentRouter
