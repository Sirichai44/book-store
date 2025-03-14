import { Component } from "@angular/core"
import { LucideAngularModule, Search } from "lucide-angular"

@Component({
  selector: "app-search",
  imports: [LucideAngularModule],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.css",
})
export class SearchComponent {
  readonly searchIcon = Search
}
