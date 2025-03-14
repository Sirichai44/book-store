import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, ActivatedRoute } from "@angular/router"
import { BooksService } from "../../services/books.service"
import { Book } from "../../types/books"
import {
  LucideAngularModule,
  Star,
  StarHalf,
  ShoppingBasket,
} from "lucide-angular"

@Component({
  selector: "app-books-list",
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./books-list.component.html",
  styleUrl: "./books-list.component.css",
})
export class BooksListComponent {
  StarIcon = Star
  StarHalfIcon = StarHalf
  ShoppingBasketIcon = ShoppingBasket
  books: Book[] = []
  search = ""
  page = 1
  limit = 20

  constructor(
    private booksService: BooksService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.search = params["search"] || ""
      this.page = params["page"] || 1
      this.limit = params["limit"] || 10
      this.getBooks(this.page, this.limit, this.search)
      this.updateQueryParams()
    })
  }

  getBooks(page: number, limit: number, search: string) {
    this.booksService.getBooks(page, limit, search).subscribe((data) => {
      this.books = data
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

  onChangePage(nav: "prev" | "next") {
    if (nav === "prev") {
      this.page--
    } else {
      this.page++
    }
    this.updateQueryParams()
  }
}
