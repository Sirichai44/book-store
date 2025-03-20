import axios from "axios"
import type { Payment } from "../types/payment"

const paymentServiceUrl = "http://localhost:8081/payment"

export const payment = async (item: Payment) => {
  try {
    const res = await axios.post(paymentServiceUrl, item)
    return res.data
  } catch (error: any) {
    const message = error.response?.data.message || "Connection error"
    throw new Error(`Payment service: ${message}`)
  }
}
