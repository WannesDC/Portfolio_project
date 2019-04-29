import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Portfolio } from '../portfolio.model';
import { PortfolioDataService } from '../portfolio-data.service';


@Component({
  selector: 'app-main-portfolio',
  templateUrl: './main-portfolio.component.html',
  styleUrls: ['./main-portfolio.component.css']
})
export class MainPortfolioComponent implements OnInit {

  private _fetchPortfolios$: Observable<Portfolio> = this._portfolioDataService.getPortfolioByUser$();
  
 
  
  constructor(private _portfolioDataService: PortfolioDataService) { }

  ngOnInit() {
    //console.log(this._fetchPortfolios$;

      console.log(this._portfolioDataService.getPortfolioByUser$().subscribe(val => console.log(val)));
  }

  get portfolios$(){
    return this._fetchPortfolios$;
  }

}
