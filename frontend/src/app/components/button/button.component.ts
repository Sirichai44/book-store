import { Component, EventEmitter, Input, Output } from "@angular/core"
import { LucideAngularComponent, LucideAngularModule } from "lucide-angular"
import { MatButtonModule } from "@angular/material/button"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-button",
  imports: [MatButtonModule, LucideAngularModule, CommonModule],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.css",
})
export class ButtonComponent {
  @Input() label: string = ""
  @Input() type: "button" | "submit" | "reset" = "button"
  @Input() icon: LucideAngularComponent["name"] = ""
  @Input() disabled: boolean = false
  @Output() onClick = new EventEmitter<void>()

  handleClick() {
    this.onClick.emit()
  }
}
