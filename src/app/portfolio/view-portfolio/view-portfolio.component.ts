import { Component, OnInit } from '@angular/core';
import { PortfolioDataService } from '../portfolio-data.service';
import { Portfolio } from '../portfolio.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-portfolio',
  templateUrl: './view-portfolio.component.html',
  styleUrls: ['./view-portfolio.component.css']
})
export class ViewPortfolioComponent implements OnInit {

  public portfolio : Portfolio

  constructor(private route: ActivatedRoute) { }

  ngOnInit() { //How do I get the user their portfolio Id? --> Routing! Add the Id of the previously created portfolio to the link?
    this.route.data.subscribe(item => (this.portfolio = item['portfolio']));
  }

}
