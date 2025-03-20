import * as paymentService from "../services/payment_service.ts"
import axios from "axios"

const mockedAxios = jest.fn().mockResolvedValue({})
axios.post = mockedAxios

describe("Payment Service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Process Payment", () => {
    it("should return data when payment is successful", async () => {
      const mockReq = {
        amount: 100,
        currency: "USD",
        card: { number: "1234567890123456", expiry: "01/25", cvv: "123" },
      }
      const mockRes = {
        data: {
          status: "success",
          message: "Payment successful",
          transactionId: "1234567890",
        },
      }

      mockedAxios.mockResolvedValue(mockRes)

      const result = await paymentService.payment(mockReq)

      expect(mockedAxios).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockRes.data)
      expect(result).toHaveProperty("transactionId")
    })

    it("should return error when payment is unsuccessful", async () => {
      const mockReq = {
        amount: 100,
        currency: "USD",
        card: { number: "1234567890123456", expiry: "01/25", cvv: "1234" },
      }

      mockedAxios.mockRejectedValue(new Error("An error occurred"))

      try {
        await paymentService.payment(mockReq)
      } catch (error) {
        expect(mockedAxios).toHaveBeenCalledTimes(1)
        expect(error).toBeInstanceOf(Error)
      }
    })
  })
})
