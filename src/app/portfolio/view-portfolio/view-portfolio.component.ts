import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { NavbarService } from 'src/app/navbar.service';
import { Portfolio } from '../data-types/portfolio';
import { PortfolioDataService } from '../portfolio-data.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-view-portfolio',
  templateUrl: './view-portfolio.component.html',
  styleUrls: ['./view-portfolio.component.css']
})

export class ViewPortfolioComponent implements OnInit, OnDestroy {

  public portfolio: Portfolio;
  loadingRouteConfig: boolean;

  public pid: number;

  public imageToShow: any;
  public isImageLoading = true;

  public pdfToShow: any;
  public isPDFLoading = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private nav: NavbarService, 
              private _portfolioDataService: PortfolioDataService, 
              private sanitizer: DomSanitizer) {

  }

  getYear(date: Date) {
    const d = new Date(date);
    return d.getFullYear();
  }
  formatDate(date: Date) {
    const d = new Date(date);
    return d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
  }

  click() {
    window.scroll(0, 0);
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
    this.route.data.subscribe(item => (this.portfolio = item.portfolio));

    this.route.paramMap.subscribe(params => {
      this.pid = Number(params.get("id"));
    })

    this._portfolioDataService.getImage(this.pid).subscribe(
      data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      }, error => {
        this.isImageLoading = true;
        console.log(error);
      }

    );

    this._portfolioDataService.getResume(this.pid).subscribe(
      data => {
        const file = new Blob([data], { type: 'application/pdf' });
        const something = URL.createObjectURL(file);
        this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(something);  
        this.isPDFLoading = false;
      }, error => {
        this.isPDFLoading = true;
        console.log(error);
      }

    );

  }

  get image(): string {
    if (this.portfolio != null) {
      if (this.imageToShow == null ) {
        return '../../../assets/images/default-profile-pic.png';
      } else {
        return this.imageToShow;
      }
    } else {
      return null;
    }
  }

  private createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
       this.imageToShow = reader.result;
    }, false);

    if (image) {
       reader.readAsDataURL(image);
    }
 }

  ngOnDestroy() {
    this.nav.show();
  }

}
