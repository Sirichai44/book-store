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
      {
        path: "detail/:id",
        loadComponent: () =>
          import("./pages/detail-book/detail-book.component").then(
            (m) => m.DetailBookComponent,
          ),
      },
      {
        path: "payment",
        loadComponent: () =>
          import("./pages/payment/payment.component").then(
            (m) => m.PaymentComponent,
          ),
      },
      {
        path: "404",
        loadComponent: () =>
          import("./pages/notfound/notfound.component").then(
            (m) => m.NotfoundComponent,
          ),
      },
    ],
  },
  { path: "**", redirectTo: "/404" },
]
