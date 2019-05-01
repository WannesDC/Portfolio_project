import { Component, OnInit, OnDestroy } from '@angular/core';
import { PortfolioDataService } from '../portfolio-data.service';
import { Portfolio } from '../portfolio.model';
import { ActivatedRoute } from '@angular/router';
import { NavbarService } from 'src/app/navbar.service';

@Component({
  selector: 'app-view-portfolio',
  templateUrl: './view-portfolio.component.html',
  styleUrls: ['./view-portfolio.component.css']
})
export class ViewPortfolioComponent implements OnInit, OnDestroy {

  public portfolio : Portfolio

  constructor(private route: ActivatedRoute, private nav: NavbarService) { 
    
  }

  ngOnInit() {
    this.nav.hide();
    console.log(this.nav.visible.getValue());
    this.route.data.subscribe(item => (this.portfolio = item['portfolio']));
    
  }

  ngOnDestroy(){
    this.nav.show();
  }
}
