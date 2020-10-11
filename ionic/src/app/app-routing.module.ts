import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadChildren: () => import('./page/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./page/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'result',
    loadChildren: () => import('./page/result/result.module').then( m => m.ResultPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
