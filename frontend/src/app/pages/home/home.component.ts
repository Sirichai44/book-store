import { Component } from "@angular/core"
import { SearchComponent } from "../../components/search/search.component"
import { RouterModule } from "@angular/router"
import { BooksListComponent } from "../../components/books-list/books-list.component"

@Component({
  selector: "app-home",
  imports: [RouterModule, SearchComponent, BooksListComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {}
