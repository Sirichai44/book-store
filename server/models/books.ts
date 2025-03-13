import mongoose from "mongoose"
import { DB_NAME_BOOKS } from "../types/config.ts"

const booksSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  author: { type: String, required: true, trim: true },
  pageCount: { type: Number, required: true },
  description: { type: String, required: true, trim: true },
  publishDate: { type: mongoose.Schema.Types.Date, required: true },
  genres: { type: [String], required: true },
  language: { type: String, required: true },
  publisher: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  price: { type: Number, required: true },
  format: { type: String, required: true },
})

export default mongoose.model(DB_NAME_BOOKS, booksSchema)
