import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavbarService } from '../navbar.service';
import { AuthenticationService } from './../user/authentication.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  loggedInUser$ = this._authenticationService.user$;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

    visible$: boolean;

  constructor(
    private _authenticationService: AuthenticationService,
    private breakpointObserver: BreakpointObserver,
    private nav: NavbarService,

  ) {
  }

  ngOnInit() {
    this.nav.visible.subscribe(x => this.visible$ = x);

  }

  logout() {
    this._authenticationService.logout();
    location.reload();
  }

}
