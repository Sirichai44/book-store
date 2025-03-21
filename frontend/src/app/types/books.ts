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
  isbn: string
  stock: number
  quantity: number
}

export interface DtoBooks {
  data: Book[]
  total: number
}

export interface Checkout {
  amount: number
  currency: string
  items: Item[]
}

interface Item {
  _id: string
  name: string
  quantity: number
  price: number
}

export interface Payment {
  number: string
  expiry: string
  cvv: string
}

export interface PaymentPayload {
  amount: number
  currency: string
  items: Item[]
  card: Payment
}
