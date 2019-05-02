import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPortfolioComponent } from './main-portfolio/main-portfolio.component';
import { MaterialModule } from '../material/material.module';
import { AddPortfolioComponent } from './add-portfolio/add-portfolio.component';
import { ViewPortfolioComponent } from './view-portfolio/view-portfolio.component';
import { PortfolioResolver } from './portfolio-resolver';
import { ViewByUserComponent } from './view-by-user/view-by-user.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'main-portfolio', component: MainPortfolioComponent },
  { path: 'add-portfolio', component: AddPortfolioComponent },
  { path: 'view', component: ViewByUserComponent },
  { path: '', redirectTo: 'main-portfolio', pathMatch: 'full' },
  { 
    path: 'viewPortfolio/:id',
    component: ViewPortfolioComponent,
    resolve: {portfolio: PortfolioResolver}
  }
];

@NgModule({
  declarations: [MainPortfolioComponent, AddPortfolioComponent, ViewPortfolioComponent, ViewByUserComponent, SettingsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    MaterialModule, 
    RouterModule.forChild(routes),
  ]
})
export class PortfolioModule { }
