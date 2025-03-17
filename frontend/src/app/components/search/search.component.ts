import { Component } from "@angular/core"
import { LucideAngularModule, Search } from "lucide-angular"
import { FormsModule } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"

@Component({
  selector: "app-search",
  imports: [LucideAngularModule, FormsModule],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.css",
})
export class SearchComponent {
  readonly searchIcon = Search
  textSearch = ""

  constructor(private router: Router, private route: ActivatedRoute) {}

  onSearch() {
    this.updateQueryParams()
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.textSearch,
        page: 1,
        limit: 10,
      },
      queryParamsHandling: "merge",
    })
  }
}
