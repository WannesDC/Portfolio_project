import { Component, OnInit } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { Portfolio } from '../data-types/portfolio';
import { PortfolioDataService } from '../portfolio-data.service';
import { Contact } from '../data-types/contact';




@Component({
  selector: 'app-main-portfolio',
  templateUrl: './main-portfolio.component.html',
  styleUrls: ['./main-portfolio.component.css']
})
export class MainPortfolioComponent implements OnInit {
  //portfolio$ = this._portfolioDataService.getPortfolioByUser$();
  portfolio$ : Observable<Portfolio>
  contact$: Observable<Contact>
   constructor(private _portfolioDataService: PortfolioDataService) { }

  ngOnInit() { 
    this.portfolio$ = this._portfolioDataService.getPortfolioByUser$();

   }
  


}
