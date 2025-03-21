import { Component, EventEmitter, Input, Output } from "@angular/core"
import { Book } from "../../types/books"

@Component({
  selector: "app-input-add-book",
  imports: [],
  templateUrl: "./input-add-book.component.html",
  styleUrl: "./input-add-book.component.css",
})
export class InputAddBookComponent {
  @Input() book!: Book
  @Output() onBookQuantityChange = new EventEmitter<{ book: Book }>()

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement
    const value = parseInt(target.value, 10)

    if (!isNaN(value) && value > 0) {
      const newBook = { ...this.book, quantity: value }
      this.onBookQuantityChange.emit({ book: newBook })
    }
  }

  incrementQuantity() {
    console.log(this.book)

    const book = { ...this.book, quantity: this.book.quantity + 1 }
    this.onBookQuantityChange.emit({ book })
  }

  decrementQuantity() {
    if (this.book.quantity > 1) {
      const book = { ...this.book, quantity: this.book.quantity - 1 }
      this.onBookQuantityChange.emit({ book })
    }
  }
}
