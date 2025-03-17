import { CommonModule } from "@angular/common"
import { Component, Input } from "@angular/core"
import { LucideAngularModule, Star, StarHalf } from "lucide-angular"

@Component({
  selector: "app-star",
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./star.component.html",
  styleUrl: "./star.component.css",
})
export class StarComponent {
  @Input() rating = 0
  @Input() size = 12
  @Input() txtSize = 12

  StarIcon = Star
  StarHalfIcon = StarHalf
  constructor() {}
}
