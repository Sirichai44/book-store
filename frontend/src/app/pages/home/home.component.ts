import { Component } from "@angular/core"
import { SearchComponent } from "../../components/search/search.component"
import { RouterModule } from "@angular/router"
import { LucideAngularModule, ShoppingCart } from "lucide-angular"
import { BooksListComponent } from "../../components/books-list/books-list.component"
import { BooksService } from "../../services/books.service"
import { Subscription } from "rxjs"
import { Book } from "../../types/books"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-home",
  imports: [
    RouterModule,
    SearchComponent,
    BooksListComponent,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  ShoppingCartIcon = ShoppingCart
  showDetailCart = false
  carts: Book[] = []
  private cartSubscription: Subscription = new Subscription()

  constructor(private booksService: BooksService) {}

  ngOnInit() {
    this.cartSubscription = this.booksService.getCart().subscribe((carts) => {
      this.carts = carts
    })
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe()
  }
}
