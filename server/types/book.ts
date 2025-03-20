export interface BooksListRequestBody {
  search: string
  page: string
  limit: string
}

export interface StockBook {
  _id: string
  stock: number
  price: number
  insufficientStock: boolean
}
