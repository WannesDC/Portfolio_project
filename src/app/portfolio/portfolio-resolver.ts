import { Injectable } from '@angular/core';
import { Portfolio } from './data-types/portfolio';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PortfolioDataService } from './portfolio-data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'

})

export class PortfolioResolver implements Resolve<Portfolio>{
    
    constructor(private portfolioService: PortfolioDataService){}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Portfolio> {
        return this.portfolioService.getPortfolio$(route.params['id']);
    }
}