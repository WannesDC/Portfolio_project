import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { Portfolio } from './data-types/portfolio';
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

  get portfolios$(): Observable<Portfolio[]>{
    return this.http.get<Portfolio>(`${environment.apiUrl}/Portfolios/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }

  putPortfolio(id:number, portfolio: Portfolio){

    return this.http
    .put<Portfolio>(`${environment.apiUrl}/Portfolios/${id}/`,portfolio);
  }

  deletePortfolio(id:number){
    return this.http
    .delete<Portfolio>(`${environment.apiUrl}/Portfolios/${id}`);
  }
  addNewPortfolio(email: string, portfolio: Portfolio){

    return this.http
    .post<Portfolio>(`${environment.apiUrl}/Portfolios/`,portfolio);
  }

  getPortfolio$(id): Observable<Portfolio>{
    return this.http.get<Portfolio>(`${environment.apiUrl}/Portfolios/${id}`)
    .pipe();
  }

  getPortfolioByUser$(): Observable<Portfolio>{
  return this.http.get<Portfolio>(`${environment.apiUrl}/Portfolios/byUser`)
  .pipe(catchError(error => {
    this.loadingError$.next(error.statusText);
    return of(null);
  }));
  }
}
