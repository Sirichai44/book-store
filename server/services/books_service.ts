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

  pipeline.push(
    {
      $project: {
        title: 1,
        description: 1,
      },
    },
    { $skip: skip },
    { $limit: limit },
  )

  const books = await BooksSchema.aggregate(pipeline)

  return books
}

export const getBookById = async (id: string) => {
  return await BooksSchema.findById(id)
}
