import { Component } from "@angular/core"
import { BooksService } from "../../services/books.service"
import { ActivatedRoute, Router } from "@angular/router"
import { Book as BookType } from "../../types/books"
import { catchError, of, Subscription } from "rxjs"
import { CommonModule } from "@angular/common"
import {
  LucideAngularModule,
  BookOpen,
  Barcode,
  Book,
  ShoppingBasket,
} from "lucide-angular"
import { StarComponent } from "../../components/star/star.component"
import { ButtonComponent } from "../../components/button/button.component"

@Component({
  selector: "app-detail-book",
  imports: [CommonModule, LucideAngularModule, StarComponent, ButtonComponent],
  templateUrl: "./detail-book.component.html",
  styleUrl: "./detail-book.component.css",
})
export class DetailBookComponent {
  BookOpenIcon = BookOpen
  BarcodeIcon = Barcode
  BookIcon = Book
  ShoppingBasketIcon = ShoppingBasket

  private detailBookSubscription: Subscription = new Subscription()

  bookDetail: BookType = {
    _id: "",
    title: "",
    author: "",
    description: "",
    format: "",
    genres: [],
    image: "",
    pageCount: 0,
    price: 0,
    publishDate: "",
    publisher: "",
    rating: 0,
    isbn: "",
  }

  id = ""

  constructor(
    private booksService: BooksService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.detailBookSubscription = this.route.params.subscribe((params) => {
      this.id = params["id"]
      this.booksService
        .getBook(this.id)
        .pipe(
          catchError((error) => {
            console.log("error", error)
            if (error.status === 404) {
              this.router.navigate(["/404"])
            }

            return of(null)
          }),
        )
        .subscribe((book) => {
          if (book) {
            this.bookDetail = book
          }
        })
    })
  }

  ngOnDestroy() {
    this.detailBookSubscription.unsubscribe()
  }

  onAddToCart(book: BookType) {
    this.booksService.addBook(book)
  }
}
