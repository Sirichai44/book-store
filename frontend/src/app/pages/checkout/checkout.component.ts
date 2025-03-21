import { Component } from "@angular/core"
import { BooksService } from "../../services/books.service"
import { Subscription } from "rxjs"
import { Book, Checkout } from "../../types/books"
import { CommonModule } from "@angular/common"
import { ButtonComponent } from "../../components/button/button.component"
import { Router, RouterModule } from "@angular/router"
import { InputAddBookComponent } from "../../components/input-add-book/input-add-book.component"
import { ToastrService } from "ngx-toastr"

@Component({
  selector: "app-checkout",
  imports: [CommonModule, ButtonComponent, RouterModule, InputAddBookComponent],
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.css",
})
export class CheckoutComponent {
  carts: Book[] = []
  private cartSubscription: Subscription = new Subscription()

  constructor(
    private booksService: BooksService,
    private router: Router,
    private toastr: ToastrService,
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

  outOfStock(cart: Book[]) {
    return cart.filter((c) => c.quantity > c.stock)
  }

  onCheckout() {
    const outOfStock = this.outOfStock(this.carts)
    if (outOfStock.length) {
      const words = outOfStock.map((c) => c.title).join(", ")
      this.toastr.warning(`${words} out of stock`)
      return
    }

    const obj: Checkout = {
      amount: this.getTotalPrice(),
      currency: "USD",
      items: this.carts.map((cart) => ({
        _id: cart._id,
        name: cart.title,
        quantity: cart.quantity,
        price: cart.price,
      })),
    }

    this.booksService.setObjCheckout(obj)
    this.router.navigate(["/payment"])
  }

  onBookQuantityChange({ book }: { book: Book }) {
    const newCart = this.carts.map((cart) => ({
      ...cart,
      quantity: cart._id === book._id ? book.quantity : cart.quantity,
    }))

    this.booksService.setCart(newCart)
  }
}
