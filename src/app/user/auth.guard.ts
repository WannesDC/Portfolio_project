import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    var x = state.url.toString().split('/');
    if (this.authService.user$.getValue() || x[x.length-2] === "viewPortfolio") {
      console.log("success");
      return true;
    }
    this.authService.redirectUrl = state.url;
    this.router.navigate(['/main-page']);
    return false;
    
  }
}
