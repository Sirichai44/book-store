import type { PipelineStage } from "mongoose"
import BooksSchema from "../models/books.ts"

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
