import { Types, type PipelineStage } from "mongoose"
import BooksSchema from "../models/books.ts"
import type { ItemPayment } from "../types/payment.ts"
import type { StockBook } from "../types/book.ts"

export const getBooks = async (page: number, limit: number, search: string) => {
  const skip = (page - 1) * limit
  const pipeline: PipelineStage[] = []

  if (search) {
    pipeline.push({
      $search: {
        index: "default",
        text: {
          query: search,
          path: ["title", "description"],
        },
      },
    })
  }

  pipeline.push({
    $facet: {
      data: [
        {
          $project: {
            title: 1,
            author: 1,
            rating: 1,
            price: 1,
            image: 1,
            stock: 1,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ],
      total: [{ $count: "count" }],
    },
  })

  const books = await BooksSchema.aggregate(pipeline)

  const data = books[0]?.data || []
  const total = books[0]?.total?.[0]?.count || 0

  const obj = { data, total }

  return obj
}

export const getBookById = async (id: string) => {
  return await BooksSchema.findById(id)
}

export const findAndUpdateStock = async (updates: ItemPayment[]) => {
  const bulkOps = updates.map((update) => ({
    updateOne: {
      filter: { _id: update._id },
      update: { $inc: { stock: -update.quantity } },
    },
  }))

  return await BooksSchema.bulkWrite(bulkOps)
}

export const getStock = async (items: ItemPayment[]) => {
  const bookIds = items.map((item) => new Types.ObjectId(item._id))
  const quantities = items.map((item) => item.quantity)

  const books = await BooksSchema.aggregate([
    { $match: { _id: { $in: bookIds } } },
    {
      $project: {
        _id: { $toString: "$_id" },
        stock: 1,
        price: 1,
        insufficientStock: {
          $lt: [
            "$stock",
            {
              $arrayElemAt: [quantities, { $indexOfArray: [bookIds, "$_id"] }],
            },
          ],
        },
      },
    },
  ])

  return books as StockBook[]
}

export const checkInsufficientStock = async (books: StockBook[]) => {
  const insufficientStockBooks = books.filter((book) => book.insufficientStock)
  if (insufficientStockBooks.length) {
    throw new Error(
      "Book Service: Out of stock books id: " +
        insufficientStockBooks.map((book) => book._id).join(", "),
    )
  }
}

export const checkPrice = async (
  items: ItemPayment[],
  books: StockBook[],
  amount: number,
) => {
  const totalPrices = books.reduce(
    (acc, book) =>
      acc + book.price * items.find((item) => item._id === book._id)!.quantity,
    0,
  )

  if (amount !== totalPrices) {
    throw new Error(
      `Book Service: Total price mismatch, store price ${totalPrices} but request price ${amount}`,
    )
  }
}
