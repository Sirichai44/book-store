import { Routes } from "@angular/router"

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/layout/main-layout/main-layout.component").then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/home/home.component").then((m) => m.HomeComponent),
      },
      {
        path: "checkout",
        loadComponent: () =>
          import("./pages/checkout/checkout.component").then(
            (m) => m.CheckoutComponent,
          ),
      },
    ],
  },
  { path: "**", redirectTo: "" },
]
