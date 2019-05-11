import { Component, OnInit, OnDestroy } from '@angular/core';
import { PortfolioDataService } from '../portfolio-data.service';
import { Portfolio } from '../data-types/portfolio';
import { ActivatedRoute, RouteConfigLoadStart, RouteConfigLoadEnd, Router } from '@angular/router';
import { NavbarService } from 'src/app/navbar.service';


@Component({
  selector: 'app-view-portfolio',
  templateUrl: './view-portfolio.component.html',
  styleUrls: ['./view-portfolio.component.css']
})

export class ViewPortfolioComponent implements OnInit, OnDestroy {

  public portfolio : Portfolio;
  loadingRouteConfig: boolean;

  constructor(private router: Router,private route: ActivatedRoute, private nav: NavbarService) { 
    
  }

  getYear(date:Date){
    let d = new Date(date);
    return d.getFullYear();
  }
  formatDate(date:Date){
    let d = new Date(date);
    return d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear();
  }

  click(){
    window.scroll(0,0);
  }
  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
          this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.loadingRouteConfig = false;
      }
  });

    this.nav.hide();
    console.log(this.nav.visible.getValue());
    this.route.data.subscribe(item => (this.portfolio = item['portfolio']));
    
  }

  ngOnDestroy(){
    this.nav.show();
  }
}
