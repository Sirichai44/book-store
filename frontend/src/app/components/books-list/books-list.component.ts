import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, ActivatedRoute } from "@angular/router"
import { BooksService } from "../../services/books.service"
import { Book, DtoBooks } from "../../types/books"
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator"
import { LucideAngularModule, ShoppingBasket } from "lucide-angular"
import { Subscription } from "rxjs"
import { StarComponent } from "../star/star.component"
import { ButtonComponent } from "../button/button.component"

@Component({
  selector: "app-books-list",
  imports: [
    CommonModule,
    LucideAngularModule,
    MatPaginatorModule,
    StarComponent,
    ButtonComponent,
  ],
  templateUrl: "./books-list.component.html",
  styleUrl: "./books-list.component.css",
})
export class BooksListComponent {
  ShoppingBasketIcon = ShoppingBasket
  data: DtoBooks = {
    data: [],
    total: 0,
  }
  search = ""
  page = 1
  limit = 20
  private queryParamsSubscription: Subscription = new Subscription()
  private bookListSubscription: Subscription = new Subscription()

  constructor(
    private booksService: BooksService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.search = params["search"] || ""
        this.page = params["page"] || 1
        this.limit = params["limit"] || 10
        this.getBooks(this.page, this.limit, this.search)
      },
    )

    this.bookListSubscription = this.booksService
      .getBookList()
      .subscribe((data) => {
        this.data = data
      })
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe()
    this.bookListSubscription.unsubscribe()
  }

  getBooks(page: number, limit: number, search: string) {
    this.booksService.getBooks(page, limit, search).subscribe((data) => {
      this.booksService.setBookList(data)
    })
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.search,
        page: this.page,
        limit: this.limit,
      },
      queryParamsHandling: "merge",
    })
  }

  onChangePage(event: PageEvent) {
    this.page = event.pageIndex + 1
    this.limit = event.pageSize
    this.updateQueryParams()
  }

  onAddToCart(book: Book) {
    this.booksService.addBook(book)
  }

  onViewBook(book: Book) {
    this.router.navigate(["/detail", book._id])
  }
}
