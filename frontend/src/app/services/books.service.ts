import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BASE_URL } from "./apis"
import { Book, CartBooks, Checkout, DtoBooks } from "../types/books"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class BooksService {
  private booksUrl = `${BASE_URL}/books`

  private cartBooks$ = new BehaviorSubject<CartBooks[]>([])
  private bookList$ = new BehaviorSubject<DtoBooks>({
    data: [],
    total: 0,
  })
  private objCheckout$ = new BehaviorSubject<Checkout>({
    amount: 0,
    currency: "",
    items: [],
  })

  constructor(private http: HttpClient) {}

  getBooks(page: number, limit: number, search: string) {
    const query = { page: page, limit: limit, search: search }
    return this.http.get<DtoBooks>(this.booksUrl, { params: query })
  }

  getBook(id: string) {
    return this.http.get<Book>(`${this.booksUrl}/${id}`)
  }

  addBook(book: Book) {
    const hasBook = this.cartBooks$.getValue().find((b) => b._id === book._id)
    if (hasBook) {
      const newCart = this.cartBooks$.getValue().map((b) => ({
        ...b,
        quantity: b._id === book._id ? b.quantity + 1 : b.quantity,
      }))

      this.cartBooks$.next(newCart)
    } else {
      this.cartBooks$.next([
        ...this.cartBooks$.getValue(),
        { ...book, quantity: 1 },
      ])
    }
  }

  getCart() {
    return this.cartBooks$.asObservable()
  }

  setCart(carts: CartBooks[]) {
    this.cartBooks$.next(carts)
  }

  setBookList(books: DtoBooks) {
    this.bookList$.next(books)
  }

  getBookList() {
    return this.bookList$.asObservable()
  }

  removeCart(id: string) {
    const newCart = this.cartBooks$.getValue().filter((b) => b._id !== id)
    this.cartBooks$.next(newCart)
  }

  setObjCheckout(obj: Checkout) {
    this.objCheckout$.next(obj)
  }

  getObjCheckout() {
    return this.objCheckout$.asObservable()
  }
}
