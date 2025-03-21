import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BASE_URL } from "./apis"
import { Book, Checkout, DtoBooks } from "../types/books"
import { BehaviorSubject } from "rxjs"
import { ToastrService } from "ngx-toastr"

@Injectable({
  providedIn: "root",
})
export class BooksService {
  private booksUrl = `${BASE_URL}/books`

  private cartBooks$ = new BehaviorSubject<Book[]>([])
  private bookList$ = new BehaviorSubject<DtoBooks>({
    data: [],
    total: 0,
  })
  private objCheckout$ = new BehaviorSubject<Checkout>({
    amount: 0,
    currency: "",
    items: [],
  })

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {}

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
      const overStock = hasBook.quantity + book.quantity > hasBook.stock
      if (overStock) {
        this.toastr.warning("Stock is not enough")
        return
      }

      const newCart = this.cartBooks$.getValue().map((b) => ({
        ...b,
        quantity: b._id === book._id ? b.quantity + book.quantity : b.quantity,
      }))

      this.cartBooks$.next(newCart)
    } else {
      const overStock = book.quantity > book.stock
      if (overStock) {
        this.toastr.warning("Stock is not enough")
        return
      }

      this.cartBooks$.next([...this.cartBooks$.getValue(), book])
    }
  }

  getCart() {
    return this.cartBooks$.asObservable()
  }

  setCart(carts: Book[]) {
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
