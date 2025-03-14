import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BASE_URL } from "./apis"
import { Book } from "../types/books"

@Injectable({
  providedIn: "root",
})
export class BooksService {
  private booksUrl = `${BASE_URL}/books`

  constructor(private http: HttpClient) {}

  getBooks(page: number, limit: number, search: string) {
    const query = { page: page, limit: limit, search: search }
    return this.http.get<Book[]>(this.booksUrl, { params: query })
  }
}
