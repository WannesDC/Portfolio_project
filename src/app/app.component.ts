import { AuthenticationService } from './user/authentication.service';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Project';
  loggedInUser$ = this._authenticationService.user$;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  loadingRouteConfig: boolean;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private _authenticationService: AuthenticationService, 
    private router:Router
  ) {

    
  }

  ngOnInit(){

    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
          this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.loadingRouteConfig = false;
      }
  });
  }

}
