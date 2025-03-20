export interface ProcessPayment {
  amount: number
  currency: string
  items: ItemPayment[]
  card: Card
}

export interface Payment extends Omit<ProcessPayment, "items"> {}

interface Card {
  number: string
  expiry: string
  cvv: string
}

export interface ItemPayment {
  _id: string
  name: string
  quantity: number
  price: number
}
