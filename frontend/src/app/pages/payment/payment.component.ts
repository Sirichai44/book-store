import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { ButtonComponent } from "../../components/button/button.component"
import { BooksService } from "../../services/books.service"
import { PaymentService } from "../../services/payment.service"

@Component({
  selector: "app-payment",
  imports: [ReactiveFormsModule, ButtonComponent, CommonModule],
  templateUrl: "./payment.component.html",
  styleUrl: "./payment.component.css",
})
export class PaymentComponent {
  paymentForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: [
        "",
        [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)],
      ],
      expiryDate: [
        "",
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ["", [Validators.required, Validators.pattern(/^\d{3}$/)]],
    })
  }

  ngOnInit(): void {
    this.setupExpiryDateFormatting()
    this.setupCardNumberFormatting()
  }

  private setupExpiryDateFormatting(): void {
    this.paymentForm.get("expiryDate")?.valueChanges.subscribe((value) => {
      if (/[^0-9\/]/.test(value)) {
        const newValue = value.replace(/[^0-9\/]/g, "")
        this.paymentForm
          .get("expiryDate")
          ?.setValue(newValue, { emitEvent: false })
        return
      }

      if (value.length === 2 && !value.includes("/")) {
        this.paymentForm
          .get("expiryDate")
          ?.setValue(value + "/", { emitEvent: false })
      } else if (value.length === 3 && value.includes("/")) {
        const newValue = value.replace("/", "")
        this.paymentForm
          .get("expiryDate")
          ?.setValue(newValue, { emitEvent: false })
      }
    })
  }

  private setupCardNumberFormatting(): void {
    this.paymentForm.get("cardNumber")?.valueChanges.subscribe((value) => {
      if (/[^0-9\s]/.test(value)) {
        const newValue = value.replace(/[^0-9\s]/g, "")
        this.paymentForm
          .get("cardNumber")
          ?.setValue(newValue, { emitEvent: false })
        return
      }

      const formattedValue = value
        .replace(/\s?/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
      if (value !== formattedValue) {
        this.paymentForm
          .get("cardNumber")
          ?.setValue(formattedValue, { emitEvent: false })
      }
    })
  }

  get cardNumber() {
    return this.paymentForm.get("cardNumber")
  }

  get expiryDate() {
    return this.paymentForm.get("expiryDate")
  }

  get cvv() {
    return this.paymentForm.get("cvv")
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const { cardNumber, expiryDate, cvv } = this.paymentForm.value
      this.paymentService.payment({
        number: cardNumber,
        expiry: expiryDate,
        cvv,
      })
    }
  }
}
