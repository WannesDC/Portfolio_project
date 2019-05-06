import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Portfolio } from '../data-types/portfolio';
import { PortfolioDataService } from '../portfolio-data.service';



@Component({
  selector: 'app-view-by-user',
  templateUrl: './view-by-user.component.html',
  styleUrls: ['./view-by-user.component.css']
})

export class ViewByUserComponent implements OnInit {

  public contact: FormGroup;
  portfolio$ : Portfolio;

  constructor(private _portfolioDataService : PortfolioDataService) { }

  ngOnInit() {
     this._portfolioDataService.getPortfolioByUser$().subscribe(val => this.portfolio$ = val);
  }

  //evt deleten van portfolio ook?
  onSubmit(){}

  delete(id:number){
    this._portfolioDataService.deletePortfolio(id);
  }
}
