import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Contact } from './data-types/contact';
import { Education } from './data-types/education';
import { Experience } from './data-types/experience';
import { Portfolio } from './data-types/portfolio';
import { Skill } from './data-types/skill';
import { Work } from './data-types/work';


@Injectable({
  providedIn: 'root'
})

export class PortfolioDataService {
  public loadingError$ = new Subject<string>();
  public token: string;
  private readonly _tokenKey = 'currentUser';
  public redirectUrl: string;

  


  constructor(private http: HttpClient) {
    this.token = localStorage.getItem(this._tokenKey);
  }

  get portfolios$(): Observable<Portfolio[]> {
    return this.http.get<Portfolio>(`${environment.apiUrl}/Portfolios/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }

  // gebruik dit voor contact?
  putPortfolio(id: number, portfolio: Portfolio) {

    return this.http
    .put<Portfolio>(`${environment.apiUrl}/Portfolios/${id}/`, portfolio);
  }

  deletePortfolio(id: number) {
    return this.http.delete<Portfolio>(`${environment.apiUrl}/Portfolios/${id}`).subscribe();
  }

  addNewPortfolio(email: string, portfolio: Portfolio) {

    return this.http
    .post<Portfolio>(`${environment.apiUrl}/Portfolios/`, portfolio);
  }

  getPortfolio$(id): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${environment.apiUrl}/Portfolios/${id}`)
    .pipe(catchError(error => {
      this.loadingError$.next(error.statusText);
      return of(null);
    }));
  }

  getPortfolioByUser$(): Observable<Portfolio> {
  return this.http.get<Portfolio>(`${environment.apiUrl}/Portfolios/byUser`)
  .pipe(catchError(error => {
    this.loadingError$.next(error.statusText);
    return of(null);
  }));
  }

  // Image & Resume stuff
  postImage(uploadData: FormData) {
    return this.http.post(`${environment.apiUrl}/Portfolios/image`, uploadData);
  }
  postResume(uploadData: FormData) {
    return this.http.post(`${environment.apiUrl}/Portfolios/resume`, uploadData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getImage(id: number): Observable<File> {
    return this.http.get(`${environment.apiUrl}/Portfolios/image/${id}`, { responseType: 'blob'}).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }
  
  getResume(id: number): Observable<File> {
    return this.http.get(`${environment.apiUrl}/Portfolios/resume/${id}`, { responseType: 'blob'}).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }

  deleteImage(){
    return this.http.delete(`${environment.apiUrl}/Portfolios/image`);
  }
  deleteResume(){
    return this.http.delete(`${environment.apiUrl}/Portfolios/resume`);
  }
  // POST PORTFOLIO DETAILS
  postContact(pid: number, contact: Contact) {
    return this.http.post<Contact>(`${environment.apiUrl}/Portfolios/${pid}/contact`, contact);
  }
  postExperience(pid: number, experience: Experience) {
    return this.http.post<Experience>(`${environment.apiUrl}/Portfolios/${pid}/experiences`, experience);
  }

  postEducation(pid: number, education: Education) {
    return this.http.post<Education>(`${environment.apiUrl}/Portfolios/${pid}/educations`, education);
  }

  postWork(pid: number, work: Work) {
    return this.http.post<Work>(`${environment.apiUrl}/Portfolios/${pid}/works`, work);
  }

  postSkill(pid: number, skill: Skill) {
    return this.http.post<Skill>(`${environment.apiUrl}/Portfolios/${pid}/skills`, skill);
  }

  // DELETE PORTFOLIO DETAILS
  deleteContact(pid: number, cid: number) {
    return this.http.delete<Contact>(`${environment.apiUrl}/Portfolios/${pid}/contact/${cid}`).subscribe();
  }
  deleteExperience(pid: number, eid: number) {
    return this.http.delete<Experience>(`${environment.apiUrl}/Portfolios/${pid}/experiences/${eid}`).subscribe();
  }
  deleteEducation(pid: number, eid: number) {
    return this.http.delete<Education>(`${environment.apiUrl}/Portfolios/${pid}/educations/${eid}`).subscribe();
  }
  deleteWork(pid: number, wid: number) {
    return this.http.delete<Work>(`${environment.apiUrl}/Portfolios/${pid}/works/${wid}`).subscribe();
  }
  deleteSkill(pid: number, sid: number) {
    return this.http.delete<Skill>(`${environment.apiUrl}/Portfolios/${pid}/skills/${sid}`).subscribe();
  }

  // PUT PORTFOLIO DETAILS

  putContact(pid: number, contact: Contact, cid: number) {
    return this.http.put<Contact>(`${environment.apiUrl}/Portfolios/${pid}/contact/${cid}`, contact);
  }
  putExperience(pid: number, experience: Experience, cid: number) {
    return this.http.put<Experience>(`${environment.apiUrl}/Portfolios/${pid}/experiences/${cid}`, experience);
  }
  putEducation(pid: number, education: Education, cid: number) {
    return this.http.put<Education>(`${environment.apiUrl}/Portfolios/${pid}/educations/${cid}`, education);
  }
  putWork(pid: number, work: Work, cid: number) {
    return this.http.put<Work>(`${environment.apiUrl}/Portfolios/${pid}/works/${cid}`, work);
  }
  putSkill(pid: number, skill: Skill, cid: number) {
    return this.http.put<Skill>(`${environment.apiUrl}/Portfolios/${pid}/skills/${cid}`, skill);
  }

  // GET PORTFOLIO DETAILS

  getContact(pid: number) {
    return this.http.get<Contact>(`${environment.apiUrl}/Portfolios/${pid}/contact/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }
  getExperience(pid: number) {
    return this.http.get<Experience>(`${environment.apiUrl}/Portfolios/${pid}/experiences/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }
  getEducation(pid: number) {
    return this.http.get<Education>(`${environment.apiUrl}/Portfolios/${pid}/educations/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }
  getWork(pid: number) {
    return this.http.get<Work>(`${environment.apiUrl}/Portfolios/${pid}/works/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }
  getSkill(pid: number) {
    return this.http.get<Skill>(`${environment.apiUrl}/Portfolios/${pid}/skills/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      })
    );
  }
}
