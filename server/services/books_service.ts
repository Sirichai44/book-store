import BooksSchema from "../models/books.ts"

export const getBooks = async (page: number, limit: number) => {
  return await BooksSchema.find()
    .skip((page - 1) * limit)
    .limit(limit)
}

export const getBookById = async (id: string) => {
  return await BooksSchema.findById(id)
}
