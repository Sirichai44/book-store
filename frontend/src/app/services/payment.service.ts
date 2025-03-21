import { Injectable } from "@angular/core"
import { Checkout, Payment, PaymentPayload } from "../types/books"
import { BooksService } from "./books.service"
import { ToastrService } from "ngx-toastr"
import { Router } from "@angular/router"
import { BASE_URL } from "./apis"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  private paymentUrl = `${BASE_URL}/payment`
  private checkout: Checkout = {
    amount: 0,
    currency: "",
    items: [],
  }

  constructor(
    private http: HttpClient,
    private booksService: BooksService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  payment(obj: Payment) {
    this.booksService.getObjCheckout().subscribe((res) => {
      this.checkout = res
    })
    const payload: PaymentPayload = {
      amount: parseFloat(this.checkout.amount.toFixed(2)),
      currency: this.checkout.currency,
      items: this.checkout.items,
      card: {
        ...obj,
        number: obj.number.replace(/\s/g, ""),
      },
    }

    return this.http.post<PaymentPayload>(this.paymentUrl, payload).subscribe(
      (res) => {
        this.toastr.success("Payment Success")
        this.booksService.setCart([])
        this.booksService.setObjCheckout({
          amount: 0,
          currency: "",
          items: [],
        })

        setTimeout(() => {
          this.router.navigate(["/"])
        }, 1000)
      },
      (err) => {
        this.toastr.error("Payment Failed")
      },
    )
  }
}
