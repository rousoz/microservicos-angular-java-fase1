import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () => import('./products-page/products-page.component').then((m) => m.ProductsPageComponent)
  },
  {
    path: 'inventory',
    loadComponent: () => import('./inventory-items-page/inventory-items-page.component').then((m) => m.InventoryItemsPageComponent)
  },
  { path: '**', redirectTo: 'products' }
];
