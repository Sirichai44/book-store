import { Component } from "@angular/core"
import { BooksService } from "../../services/books.service"
import { Subscription } from "rxjs"
import { CartBooks } from "../../types/books"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-checkout",
  imports: [CommonModule],
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.css",
})
export class CheckoutComponent {
  carts: CartBooks[] = []
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

  getTotalPrice() {
    return this.carts.reduce((acc, cart) => acc + cart.price * cart.quantity, 0)
  }
}
