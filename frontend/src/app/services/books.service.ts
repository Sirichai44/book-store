import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BASE_URL } from "./apis"
import { Book, CartBooks, DtoBooks } from "../types/books"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class BooksService {
  private booksUrl = `${BASE_URL}/books`

  private cartBooks = new BehaviorSubject<CartBooks[]>([])

  constructor(private http: HttpClient) {}

  getBooks(page: number, limit: number, search: string) {
    const query = { page: page, limit: limit, search: search }
    return this.http.get<DtoBooks>(this.booksUrl, { params: query })
  }

  addBook(book: Book) {
    const hasBook = this.cartBooks.getValue().find((b) => b._id === book._id)
    if (hasBook) {
      const newCart = this.cartBooks.getValue().map((b) => ({
        ...b,
        quantity: b._id === book._id ? b.quantity + 1 : b.quantity,
      }))

      this.cartBooks.next(newCart)
    } else {
      this.cartBooks.next([
        ...this.cartBooks.getValue(),
        { ...book, quantity: 1 },
      ])
    }
  }

  getCart() {
    return this.cartBooks.asObservable()
  }
}
