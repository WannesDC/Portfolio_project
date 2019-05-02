import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { Portfolio } from './portfolio';
import { environment } from 'src/environments/environment';
import { map, catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class PortfolioDataService {
  public loadingError$ = new Subject<string>();
  public token : string;
  private readonly _tokenKey = 'currentUser';
  

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem(this._tokenKey);
  }

  /*get portfolios$(): Observable<Portfolio[]>{
    return this.http.get(`${environment.apiUrl}/Portfolios/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      }),
      map((list: any[]): Portfolio[] => list.map(Portfolio.fromJSON))
    );
  }*/

  get portfolios$(): Observable<Portfolio[]>{
    return this.http.get<Portfolio>(`${environment.apiUrl}/Portfolios/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }

  addNewPortfolio(email: string, portfolio: Portfolio){

    return this.http
    .post<Portfolio>(`${environment.apiUrl}/Portfolios/`,portfolio);
  }

  /*getPortfolio$(id): Observable<Portfolio>{
    return this.http.get(`${environment.apiUrl}/Portfolios/${id}`)
    .pipe(map((por:any): Portfolio => Portfolio.fromJSON(por)));
  }*/

  getPortfolio$(id): Observable<Portfolio>{
    return this.http.get<Portfolio>(`${environment.apiUrl}/Portfolios/${id}`)
    .pipe();
  }

  /*getPortfolioByUser$(): Observable<Portfolio>{
    return this.http.get(`${environment.apiUrl}/Portfolios/byUser`)
    .pipe(catchError(error => {
      this.loadingError$.next(error.statusText);
      return of(null);
    })
    ,map((por:any): Portfolio => {if(por===null){return null} else {return Portfolio.fromJSON(por)}})
    );
  }
*/
getPortfolioByUser$(): Observable<Portfolio>{
  return this.http.get(`${environment.apiUrl}/Portfolios/byUser`)
  .pipe(catchError(error => {
    this.loadingError$.next(error.statusText);
    return of(null);
  }));
  }
}
