import { Router } from "express"
import booksRouter from "./books_router.ts"
import paymentRouter from "./payment_router.ts"

const router = Router()

router.use("/books", booksRouter)
router.use("/payment", paymentRouter)

export default router
