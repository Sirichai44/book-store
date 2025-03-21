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
  Container,
} from "lucide-angular"
import { StarComponent } from "../../components/star/star.component"
import { ButtonComponent } from "../../components/button/button.component"
import { InputAddBookComponent } from "../../components/input-add-book/input-add-book.component"

@Component({
  selector: "app-detail-book",
  imports: [
    CommonModule,
    LucideAngularModule,
    StarComponent,
    ButtonComponent,
    InputAddBookComponent,
  ],
  templateUrl: "./detail-book.component.html",
  styleUrl: "./detail-book.component.css",
})
export class DetailBookComponent {
  BookOpenIcon = BookOpen
  BarcodeIcon = Barcode
  BookIcon = Book
  ShoppingBasketIcon = ShoppingBasket
  ContainerIcon = Container

  private detailBookSubscription: Subscription = new Subscription()

  bookDetail!: BookType

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
            this.bookDetail = { ...book, quantity: 1 }
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

  onBookQuantityChange(event: { book: BookType }) {
    this.bookDetail = event.book
  }
}
