import { Component } from "@angular/core"
import { BooksService } from "../../services/books.service"
import { Subscription } from "rxjs"
import { CartBooks, Checkout } from "../../types/books"
import { CommonModule } from "@angular/common"
import { ButtonComponent } from "../../components/button/button.component"
import { Router, RouterModule } from "@angular/router"

@Component({
  selector: "app-checkout",
  imports: [CommonModule, ButtonComponent, RouterModule],
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.css",
})
export class CheckoutComponent {
  carts: CartBooks[] = []
  private cartSubscription: Subscription = new Subscription()

  constructor(
    private booksService: BooksService,
    private router: Router,
  ) {}

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

  onRemoveCart(id: string) {
    this.booksService.removeCart(id)
  }

  onCheckout() {
    const obj: Checkout = {
      amount: this.getTotalPrice(),
      currency: "USD",
      items: this.carts.map((cart) => ({
        name: cart.title,
        quantity: cart.quantity,
        price: cart.price,
      })),
    }

    this.booksService.setObjCheckout(obj)

    this.router.navigate(["/payment"])
  }
}
