import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

  
function parseJwt(token) {
  if(!token){
    return null;
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private readonly _tokenKey = 'currentUser';
  private _user$: BehaviorSubject<string>;
  public redirectUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    let parsedToken = parseJwt(localStorage.getItem(this._tokenKey));
    if (parsedToken){
      const expires = new Date(parseInt(parsedToken.exp,10)*1000) < new Date();
    
      if(expires){
        localStorage.removeItem(this._tokenKey);
        parsedToken = null;
      }
    }
    this._user$ = new BehaviorSubject<string>(parsedToken && parsedToken.unique_name);
   }

  get user$(): BehaviorSubject<string> {
    return this._user$;
  }

  get token(): string {
    const localToken = localStorage.getItem(this._tokenKey);
    return !!localToken ? localToken : '';
  }

   login(email: string, password: string): Observable<boolean>{
     return this.http
     .post(
       `${environment.apiUrl}/Users`,
       {email, password}
     )
     .pipe(
       map((token: any) => {
         if (token){
           localStorage.setItem(this._tokenKey, token);
           this._user$.next(email);
           return true;
         } else {
           return false;
         }
       })
     );
   }

   logout() {
     if (this._user$.getValue()){
       localStorage.removeItem(this._tokenKey);
       this._user$.next(null);
       this.router.navigateByUrl("");
     }
   }

   register(firstname: string,
    lastname: string,email: string, password: string): Observable<boolean>{
     return this.http
     .post(`${environment.apiUrl}/Users/register`, 
     {email, password, firstname, lastname, passwordConfirmation :password})
     .pipe(
       map((token: any) => {
         if(token){
           localStorage.setItem(this._tokenKey,token);
           this._user$.next(email);
           return true;
         } else {
           return false;
         }
       })
     );
   }

   checkUserNameAvailability = (email: string): Observable<boolean> => {
    return this.http.get<boolean>(
      `${environment.apiUrl}/Users/checkusername`,
      {
        params: { email }
      }
    );
  };

}
