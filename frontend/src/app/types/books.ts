export interface Book {
  _id: string
  title: string
  author: string
  pageCount: number
  description: string
  publishDate: string
  genres: string[]
  publisher: string
  rating: number
  price: number
  format: string
  image: string
}

export interface DtoBooks {
  data: Book[]
  total: number
}
