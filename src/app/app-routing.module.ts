import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SelectivePreloadStrategy } from './selective-preload-strategy';
import { AuthGuard } from './user/auth.guard';
import { MainPageComponent } from './main-page/main-page.component';

const appRoutes: Routes = [
  {
    path: 'portfolio',
    canActivate: [AuthGuard],
    loadChildren: './portfolio/portfolio.module#PortfolioModule',
    data: { preload: true }
  },
  { path: 'main-page', component: MainPageComponent},
  { path: '', redirectTo: 'portfolio/main-portfolio', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: SelectivePreloadStrategy
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}